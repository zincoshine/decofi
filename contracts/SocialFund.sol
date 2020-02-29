pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./lendingpool/LendingPool.sol";
import "./configuration/LendingPoolAddressesProvider.sol";
import "./tokenization/AToken.sol";
import "./Types.sol";

contract SocialFund is Ownable {
   using SafeMath for uint;

    string fundName;
    uint256 fundTerm;
    uint256 fundAmt;
    uint256 numParts;
    address[] theMembers;
    mapping (address => Types.Member) private members;
    mapping (address => uint8) private lotteryStatus;
    //testing with Aave contract on Kovan network
    address constant AAVE_LENDING_POOL_ADDR = 0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5;
    address constant SABLIER_ADDR = 0xc04Ad234E01327b24a831e3718DBFcbE245904CC;
    address constant ATOKEN_ADDR = 0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a;
    uint256 MAX_LOAN_AMT;
    
    LendingPoolAddressesProvider provider;
    LendingPool lendingPool; 
    
    IERC20 depositToken;
    AToken aToken;
    address latestWinner;
    uint8 latestCycle = 0;

    modifier onlyMembers() {
        require(members[msg.sender].isEntity, "Not a valid member");
        _;
    }

    event Lottery(address indexed winner,uint8 cycle);
    event LoanInitiated(address indexed member, uint256 amount, uint8 cycle);
    event LoanRepaid(address indexed member, uint256 amount, uint8 cycle);

    constructor(string memory _fundName, 
                uint256 _fundTerm, 
                uint256 _numParts,
                uint256 _fundAmt,
                address _tokenAddr) public {
        require(_fundTerm > 0 , "Term invalid");
        require(_numParts > 0, "Number of participants invalid");
        require(_fundAmt > 0, "Amount invalid");
        fundName = _fundName;
        fundTerm = _fundTerm;
        numParts = _numParts;
        fundAmt = _fundAmt;
        provider = LendingPoolAddressesProvider(AAVE_LENDING_POOL_ADDR);
        lendingPool = LendingPool(provider.getLendingPool());
        depositToken = IERC20(_tokenAddr);
        MAX_LOAN_AMT = fundAmt.mul(fundTerm).mul(numParts).mul(75).div(100);
    }

    function() payable external {
        revert();
    }

    /**
     *Function used to add list of members associated with the social fund
     *@param An array of addresses.
     */
    function addMembers(address[] calldata _members) external onlyOwner returns (bool) {
        require(_members.length == numParts);
        theMembers = _members;
        for(uint8 i=0;i<_members.length;i++) {
            require(_members[0] != address(0), "member address invalid");
            members[_members[i]] = Types.Member({memberAddr: _members[i], loanTaken: false, isEntity: true});
        }
    }

    /**
    * Function collects funds from members deposits to aave
    * and transfer the loan amount to the chosen member
    */
    function lottery(address chosen) external onlyOwner returns (bool) {
        latestCycle++;
        uint256 amt = 0;
        for(uint8 i=0;i<theMembers.length;i++) {
            uint256 amount = depositToken.allowance(theMembers[i],address(this));
            amt = amt.add(amount);
            depositToken.transferFrom(theMembers[i],address(this),amount);
        }

        if(latestCycle == fundTerm) {
            lendingPool.repay(address(depositToken), amt.add(1), msg.sender);
            //TODO distribute interest equally to all
            aToken = AToken(ATOKEN_ADDR);
            uint256 amount = aToken.balanceOf(address(this));
            aToken.redeem(amount);
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
        lendingPool.borrow(address(depositToken),MAX_LOAN_AMT,1,0);
        members[chosen].loanTaken = true;
        return depositToken.approve(chosen,MAX_LOAN_AMT);
    }

    /**
    * Function used by the winner member to borrow a loan
    */
    function takeLoan() external onlyMembers returns (bool) {
        require(msg.sender == latestWinner);
        return depositToken.transfer(latestWinner,MAX_LOAN_AMT);
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