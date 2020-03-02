pragma solidity >=0.4.22 <0.6.0;

/************
@title CommFund Contract
@notice Contract to setup a community fund which will invest the pot of pooled investment to aave.
*/

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/aave-protocol/ILendingPool.sol";
import "./interfaces/aave-protocol/ILendingPoolAddressesProvider.sol";
import "./interfaces/aave-protocol/IAToken.sol";
import "./Types.sol";

contract CommFund is Ownable {
   using SafeMath for uint;

    /**
    @notice Configuration variables describing the fund name
    @notice term, premium, and total number of participants
    */
    string public fundName;
    uint256 public fundTerm;
    uint256 public termPremium;
    uint256 public totalParticipants;


    address[] private theMembers;
    mapping (address => Types.Member) private members;
    mapping (address => uint8) private lotteryStatus;
    uint256 private maxLoanAmt;  
    IERC20 private depositToken;
    bool private isOpen = true;

    address latestWinner;
    uint8 latestCycle = 0;
    
    /**
    @notice Aave configuration parameters.
    @notice term, premium, and total number of participants
    */
    address constant AAVE_LENDING_POOL_ADDR = 0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5;
    address constant ATOKEN_ADDR = 0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a;
    uint256 constant MAX_DAI_LOAN_AMT = 75;
    ILendingPoolAddressesProvider private provider;
    ILendingPool private lendingPool; 
    IAToken private aDaiToken;


    modifier onlyMembers() {
        require(members[msg.sender].isEntity, "Not a valid member");
        _;
    }

    modifier onlyWhenOpen() {
        require(isOpen, "Fund is closed");
        _;
    }

    modifier onlyWhenClosed() {
        require((!isOpen), "Fund is open");
        _;
    }

    event FundDeployed(
        address indexed asset,
        string name,
        uint term,
        uint premium,
        uint numParts,
        uint maxLoanAmt
    );

    event LotteryDecision(address indexed winner,uint8 cycle);
    event LoanInitiated(address indexed member, uint256 amount, uint8 cycle);
    event LoanRepaid(address indexed member, uint256 amount, uint8 cycle);

    constructor(string memory _fundName, 
                uint256 _fundTerm, 
                uint256 _numParts,
                uint256 _termPrem,
                address _asset) public {
        require(_fundTerm > 0 , "Term invalid");
        require(_numParts > 0, "Number of participants invalid");
        require(_termPrem > 0, "Amount invalid");
        require(_asset != address(0), "Asset can't be empty");
        require(_numParts == _fundTerm, "Term must match number of participants");
        fundName = _fundName;
        fundTerm = _fundTerm;
        totalParticipants = _numParts;
        termPremium = _termPrem;
        aDaiToken = IAToken(ATOKEN_ADDR);
        provider = ILendingPoolAddressesProvider(AAVE_LENDING_POOL_ADDR);
        lendingPool = ILendingPool(provider.getLendingPool());
        depositToken = IERC20(_asset);

        // maximum amount of loan available is 75% of the pot.
        maxLoanAmt = termPremium.mul(fundTerm).mul(totalParticipants).mul(MAX_DAI_LOAN_AMT).div(100);

        //emit the event
        emit FundDeployed(
            ATOKEN_ADDR,
            fundName,
            fundTerm,
            termPremium,
            totalParticipants,
            maxLoanAmt
        );
    }

    /**
    * @dev Function used add participant addresses to the fund
    **/
    function addMembers(address[] calldata _members) external onlyOwner onlyWhenOpen returns (bool) {
        require(theMembers.length < totalParticipants, "Fund doesnt accept any more members");
        require(_members.length <= totalParticipants, "Fund cant accept any more members");
        for(uint8 i=0;i<_members.length;i++) {
            require(_members[0] != address(0), "member address invalid");
            members[_members[i]] = Types.Member({memberAddr: _members[i], loanTaken: false, isEntity: true});
            theMembers.push(_members[i]);
        }
        if (theMembers.length == totalParticipants) {
            isOpen = false;
        }
    }

    /**
    * @dev Function to add a participant to the fund
    */
    function addMember(address _member) external onlyOwner onlyWhenOpen {
        require(_member != address(0), "Participant address is invalid");
        require(theMembers.length == totalParticipants, "Fund cant accept any more members");
        members[_member] = Types.Member({memberAddr: _member, loanTaken: false, isEntity: true});
        theMembers.push(_member);
        if (theMembers.length == totalParticipants) {
            isOpen = false;
        }
    }

    /**
    * @notice list all members of the fund
    */
    function listMembers() onlyOwner view external returns (address[] memory) {
        return theMembers;
    }

    /**
    * @notice show the latest lottery winner
    */
    function currentWinner() view external onlyOwner returns (address) {
        return latestWinner;
    }

    /**
    * Function collects funds from members deposits to aave
    * and transfer the loan amount to the chosen member
    * TODO
    */
    function lottery(address chosen) external onlyOwner returns (bool) {
        latestCycle++;
        uint256 amt = 0;
        for(uint8 i=0;i<theMembers.length;i++) {
            uint256 amount = depositToken.allowance(theMembers[i],address(this));
            amt = amt.add(amount);
            depositToken.transferFrom(theMembers[i],address(this),amount);
        }
        emit LotteryDecision(chosen, latestCycle);
        if(latestCycle == fundTerm) {
            lendingPool.repay(address(depositToken), amt.add(1), msg.sender);
            //TODO distribute interest equally to all
            uint256 amount = aDaiToken.balanceOf(address(this));
            aDaiToken.redeem(amount);
            //Split the amount and distribute to each member
            //TODO
            return true;
        }

        //if latest cycle is > 1 then repay loan before borrowing again
        //while repaying pay 1 more than what was borrowed
        if(latestCycle > 1) {
            lendingPool.repay(address(depositToken), amt.add(1), msg.sender);
            //emit LoanRepaid(chosen,amt,latestCycle.sub(1));
        } else {
            lendingPool.deposit(address(depositToken), amt, 0);
            lendingPool.setUserUseReserveAsCollateral(address(depositToken),true);
        }
        lendingPool.borrow(address(depositToken),maxLoanAmt,1,0);
        members[chosen].loanTaken = true;
        return depositToken.approve(chosen,maxLoanAmt);
    }

    /**
    * Function used by the winner member to borrow a loan
    */
    function borrow() external onlyMembers returns (bool) {
        require(msg.sender == latestWinner);
        emit LoanInitiated(latestWinner,maxLoanAmt,latestCycle);
        return depositToken.transfer(latestWinner,maxLoanAmt);
    }

    /**
    * function used to close the fund after its served its purpose.
    */
    function closeFund() external onlyOwner {
        //close the fund if the term is over
        require(latestCycle == fundTerm);
        //selfdestruct();
    }
}