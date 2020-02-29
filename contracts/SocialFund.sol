pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@sablier/protocol/contracts/Sablier.sol";

contract SocialFund is Ownable {

    NETWORK string;
    fundName string;
    fundTerm uint8;
    numParts uint8;
    address payable INTEREST_VAULT;
    address payable members[];
    mapping (address => uint8) lotteryStatus;
    address SABLIER_ADDRESS = "";
    Sablier sablier = Sablier(SABLIER_ADDRESS);

    constructor(_fundName memory string, 
                _fundTerm memory uint8, 
                _numParts memory uint8,
                _interestVault memory address,
                _network memory string) {
        require(_fundTerm > 0);
        require(_numParts > 0);
        require(_interestValue != address(0));
        fundName = _fundName;
        fundTerm = _fundTerm;
        numParts = _numParts;
        INTEREST_VAULT = _interestVault;
    }

    function addMembers(address[] _members) onlyOwner returns bool {
        require(_members.length == numParts);
        for(uint8 i=0;i<_members.length;i++) {
            require(_members[0] != address(0))
            members.push(_members);
        }
    }

    function deposit() onlyOwner returns bool {
        return true;
    }

    function lottery() onlyOwner returns bool {
        //fetch funds using sablier stream and deposit in aave
        //randomnly choose one member and let him withdraw loan
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