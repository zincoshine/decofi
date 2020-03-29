pragma solidity >=0.4.22 <0.6.0;

/************
@title CommFund Contract
@notice Contract to setup a community fund which will invest the pot of pooled investment to aave.
*/

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/aave-protocol/ILendingPool.sol";
import "./interfaces/aave-protocol/ILendingPoolAddressesProvider.sol";
import "./interfaces/aave-protocol/IAToken.sol";
import "./Types.sol";
import "./ICommFund.sol";
import "./SplitTokenPayments.sol";

contract CommFund is Ownable {
   using SafeMath for uint;

    string private _fundName;
    uint256 private _fundTerm;
    uint256 private _termPremium;
    uint256 private _totalParticipants;

    address[] private theMembers;
    mapping (address => Types.Member) private members;
    mapping (address => uint8) private lotteryStatus;
    uint256 private maxLoanAmt;  
    IERC20 private depositToken;
    bool private isOpen = true;

    address latestWinner;
    address lastWinner = address(0);
    uint8 latestCycle = 0;

    //KOVAN contract address
    address constant COMM_DB_ADDRESS = 0xd8877d77aD8620A227758e7C7473E7AEC50FcBea;
    
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
    // Aave pays us kick back for DAI -> aDAI conversion
    // https://developers.aave.com/#referral-program
    uint16 public constant AAVE_REFERRAL_CODE = 0;


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

    modifier whenAllFunded() {
        for(uint i=0;i < theMembers.length; i++) {
            require(depositToken.allowance(theMembers[i],address(this)) > 0, "Member hasnt deposited funds");
        }
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
    event LoanTaken(address indexed member, uint256 amount, uint8 cycle);
    event LoanRepaid(address indexed member, uint256 amount, uint8 cycle);

    constructor(string memory fundName, 
                uint256 fundTerm, 
                uint256 numParts,
                uint256 termPrem,
                address asset) public {
        require(fundTerm > 0 , "Term invalid");
        require(numParts > 0, "Number of participants invalid");
        require(termPrem > 0, "Amount invalid");
        require(asset != address(0), "Asset can't be empty");
        require(numParts == _fundTerm, "Term must match number of participants");
        _fundName = fundName;
        _fundTerm = fundTerm;
        _totalParticipants = numParts;
        _termPremium = termPrem;
        aDaiToken = IAToken(ATOKEN_ADDR);
        provider = ILendingPoolAddressesProvider(AAVE_LENDING_POOL_ADDR);
        lendingPool = ILendingPool(provider.getLendingPool());
        depositToken = IERC20(asset);

        // maximum amount of loan available is 75% of the pot.
        maxLoanAmt = _termPremium.mul(fundTerm).mul(_totalParticipants).mul(MAX_DAI_LOAN_AMT).div(100);

        //emit the event
        emit FundDeployed(
            ATOKEN_ADDR,
            _fundName,
            _fundTerm,
            _termPremium,
            _totalParticipants,
            maxLoanAmt
        );
    }

    function fundName() view external returns (string memory) {
        return _fundName;
    }

    function fundTerm() view external returns (uint256) {
        return _fundTerm;
    }

    function termPremium() view external returns (uint256) {
        return _termPremium;
    }

    function totalParticipants() view external returns (uint256) {
        return _totalParticipants;
    }

    /**
    * @dev Function used add participant addresses to the fund
    **/
    function addMembers(address[] calldata _members) external onlyOwner onlyWhenOpen {
        require(theMembers.length < _totalParticipants, "Fund doesnt accept any more members");
        require(_members.length <= _totalParticipants, "Fund cant accept any more members");
        for(uint8 i=0;i<_members.length;i++) {
            require(_members[0] != address(0), "member address invalid");
            members[_members[i]] = Types.Member({memberAddr: _members[i], loanTaken: false, isEntity: true});
            theMembers.push(_members[i]);
        }
        if (theMembers.length == _totalParticipants) {
            isOpen = false;
        }
    }

    /**
    * @dev Function to add a participant to the fund
    */
    function addMember(address _member) external onlyOwner onlyWhenOpen {
        require(_member != address(0), "Participant address is invalid");
        require(theMembers.length == _totalParticipants, "Fund cant accept any more members");
        members[_member] = Types.Member({memberAddr: _member, loanTaken: false, isEntity: true});
        theMembers.push(_member);
        if (theMembers.length == _totalParticipants) {
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
    function lottery(address chosen) external onlyOwner whenAllFunded returns (bool) {
        lastWinner = latestWinner;
        latestWinner = chosen;
        latestCycle++;
        uint256 amt = 0;
        for(uint8 i=0;i<theMembers.length;i++) {
            uint256 amount = depositToken.allowance(theMembers[i],address(this));
            amt = amt.add(amount);
            depositToken.transferFrom(theMembers[i],address(this),amount);
        }
        emit LotteryDecision(chosen, latestCycle);
        //while repaying pay 1 more than what was borrowed

        if(latestCycle == 1) {
            //For first month just deposit funds to aave and use them as collateral
            lendingPool.deposit(address(depositToken), amt, AAVE_REFERRAL_CODE);
            lendingPool.setUserUseReserveAsCollateral(address(depositToken),true);
            return true;
        }

        if(latestCycle > 1 && latestCycle <= _fundTerm) {
            //close the previous loan
            lendingPool.repay(address(depositToken), amt.add(1), msg.sender);
            emit LoanRepaid(lastWinner,amt,(latestCycle - 1));
            //Borrow a new loan for the chosen user
            lendingPool.borrow(address(depositToken),maxLoanAmt,1,0);
            members[chosen].loanTaken = true;
            return depositToken.approve(chosen,maxLoanAmt);
        } 

        if(latestCycle > _fundTerm) {
            //Close the fund and repay all members with interest
            return closeFund(amt);
        }
    }

    /**
    * Function used by the winner member to borrow a loan
    */
    function borrow() external onlyMembers returns (bool) {
        require(msg.sender == latestWinner);
        emit LoanTaken(latestWinner,maxLoanAmt,latestCycle);
        return depositToken.transfer(latestWinner,maxLoanAmt);
    }

    /**
    * function used to close the fund after its served its purpose.
    */
    function closeFund(uint256 amt) internal returns (bool){
        require(latestCycle > _fundTerm);
        //close the fund if the term is over
        lendingPool.repay(address(depositToken), amt.add(1), msg.sender);
        //TODO distribute interest equally to all
        aDaiToken.redeem(amt);
        uint256 amount = aDaiToken.balanceOf(address(this));
        //Split the amount and distribute to each member
        SplitTokenPayments paySplit = new SplitTokenPayments(theMembers, amount, address(aDaiToken));
        paySplit.release();
        //selfdestruct(owner());
        return true;
    }
}