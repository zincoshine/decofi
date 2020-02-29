pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./lendingpool/LendingPool.sol";
import "./configuration/LendingPoolAddressesProvider.sol";
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
    uint256 MAX_LOAN_AMT;
    
    LendingPoolAddressesProvider provider;
    LendingPool lendingPool; 
    
    IERC20 depositToken;
    address latestWinner;
    uint8 latestCycle = 0;

    modifier onlyMembers() {
        require(members[msg.sender].isEntity, "Not a valid member");
        _;
    }

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
        MAX_LOAN_AMT = fundAmt.mul(fundTerm).mul(numParts);
    }

    function() payable external {
        revert();
    }

    /**
    *@notice Function used to add list of members associated with the social fund
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
    *TODO
    */
    function _depositToAave(address _tokenAddr) internal returns (bool) {
        require(_tokenAddr != address(0), "Asset address invalid");
        uint256 amount = depositToken.balanceOf(address(this));
        require(amount > 0, "Amount invalid");
        lendingPool.deposit(_tokenAddr, amount, 0);
        return true;
    }

    function lottery() external onlyOwner returns (bool) {
        //fetch funds using sablier stream and deposit in aave
        //randomnly choose one member and let him withdraw loan

        //sablier.withdrawFromStream(streamId,amount);
        return true;
    }

    /**
    *@notice Function used by the winner member to borrow a loan
    */
    function takeLoan() external onlyMembers returns (bool) {
        require(msg.sender == latestWinner);
        //borrow using fixed rate of interest
        lendingPool.borrow(address(depositToken), MAX_LOAN_AMT, 1, 0);
        //transfer the funds to the winner
        return depositToken.transfer(latestWinner,MAX_LOAN_AMT);
    }

    /**
    *@notice function used to close the fund after its served its purpose.
    */
    function closeFund() external onlyOwner {
        //close the fund if the term is over
        require(latestCycle == fundTerm);
        //selfdestruct();
    }
}