pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@sablier/protocol/contracts/Sablier.sol";

contract SocialFund is Ownable {
   using SafeMath for uint;

    fundName string;
    fundTerm uint8;
    numParts uint8;
    address payable INTEREST_VAULT;
    address payable members[];
    mapping (address => uint8) lotteryStatus;
    uint256 constant MAX_LOAN_PERCENT = 85.div(100);
    address constant AAVE_LENDING_POOL_ADDR = "";
    address constant SABLIER_ADDRESS = "";
    
    LendingPoolAddressesProvider provider;
    LendingPool lendingPool; 
    Sablier sablier;
    
    IERC20 depositToken;
    address currentWinner;


    constructor(_fundName memory string, 
                _fundTerm memory uint8, 
                _numParts memory uint8,
                _interestVault memory address,
                _network memory string) {
        require(_fundTerm > 0 , "Term invalid");
        require(_numParts > 0, "Number of participants invalid");
        require(_interestVault != address(0) , "Interest vault invalid");
        fundName = _fundName;
        fundTerm = _fundTerm;
        numParts = _numParts;
        INTEREST_VAULT = _interestVault;
        sablier = Sablier(SABLIER_ADDRESS);
        provider = LendingPoolAddressesProvider(AAVE_LENDING_POOL_ADDR);
        lendingPool = LendingPool(provider.getLendingPool());
    }

    function addMembers(address[] _members) onlyOwner returns bool {
        require(_members.length == numParts);
        for(uint8 i=0;i<_members.length;i++) {
            require(_members[0] != address(0), "member address invalid");
            members.push(_members);
        }
    }

    function 

    function _depositToAave(address _tokenAddr) internal returns bool {
        require(_tokenAddr != address(0), "Asset address invalid");
        depositToken = IERC20(_tokenAddr);
        uint256 amount = token.balanceOf(this);
        require(amount > 0, "Amount invalid");
        lendingPool.deposit(_tokenAddr, amount, 0);
        return true;
    }

    function lottery() onlyOwner returns bool {
        //fetch funds using sablier stream and deposit in aave
        //randomnly choose one member and let him withdraw loan

        //sablier.withdrawFromStream(streamId,amount);
        return true;
    }

    function takeLoan() returns bool {
        //take loan if authorized/approved
        return true;
    }

    function closeFund() onlyOwner bool {
        //close the fund if the term is over
        return true;
    }
}