pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SplitTokenPayments is Context {
    using SafeMath for uint256;

    address[] private _payees;
    IERC20 private _token;
    uint256 private _total;

    event TokenTransferred(address indexed from, address indexed recipient,uint256 amount);

    constructor (address[] memory payees, uint256 total, address tokenAddr) public {
        require(payees.length > 0, "No payees to split payments");
        require(total > 0, "Total must be > 0");
        require(tokenAddr != address(0), "Valid token must be provided");
        
        for (uint256 i = 0; i < payees.length; i++) {
            require(payees[i] != address(0), "Invalid payee address");
           _payees.push(payees[i]);
        }
        _token = IERC20(tokenAddr);
        _total = total;
    }

    function release() public {
        require(_token.balanceOf(msg.sender) >= _total, "Not enough funds to release");
        for(uint i=0;i<_payees.length;i++) {
            uint256 amt = _total.div(_payees.length);
            _token.transferFrom(msg.sender,_payees[i],amt);
            emit TokenTransferred(msg.sender,_payees[i],amt);
        }
    }

}