pragma solidity >=0.4.22 <0.6.0;
/***************************
*@title ICommFund interface
*/

contract ICommFund {
    function owner() public view returns (address);
    function fundName() view external returns (string memory);
    function fundTerm() view external returns (uint256);
    function termPremium() view external returns (uint256);
    function totalParticipants() view external returns (uint256);
    function addMembers(address[] calldata _members) external;
    function addMember(address _member) external;
    function listMembers() view external returns (address[] memory);
    function currentWinner() view external returns (address);
    function lottery(address chosen) external returns (bool);
    function borrow() external returns (bool);
    function closeFund() external;
}