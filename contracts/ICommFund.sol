pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
/***************************
*@title ICommFund interface
*/

contract ICommFund is Ownable {

    /**
    @notice Configuration variables describing the fund name
    @notice term, premium, and total number of participants
    */
    string public fundName;
    uint256 public fundTerm;
    uint256 public termPremium;
    uint256 public totalParticipants;
   
    function addMembers(address[] calldata _members) external;
    function addMember(address _member) external;
    function listMembers() view external returns (address[] memory);
    function currentWinner() view external returns (address);
    function lottery(address chosen) external returns (bool);
    function borrow() external returns (bool);
    function closeFund() external;
}