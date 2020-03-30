pragma solidity >=0.4.22 <0.6.0;

import "./ICommFund.sol";

contract CommFundDb {
    address[] private activeFunds;
    /**
    @notice -  Funds that a given address is part of
     */
    mapping(address => address[]) private fundsByOwner;
    /**
    @notice - Funds for which a given address is owner of
     */
    mapping(address => address[]) private fundsByMember;

    event FundAdded(address indexed fundAddress, string fundName);
    event FundClosed(address indexed fundAddress, string fundName);

    function addFund(address _fundAddr) external {
        require(_fundAddr != address(0), "Invalid fund address");
        activeFunds.push(_fundAddr);
        ICommFund fund = ICommFund(_fundAddr);
        fundsByOwner[fund.owner()].push( _fundAddr);
        emit FundAdded(_fundAddr, fund.fundName());
    }

    function listActiveFunds() view external returns (address[] memory) {
        return activeFunds;
    }

    function listFundsByOwner(address _owner) view external returns (address[] memory) {
        require(_owner != address(0), "Owner invalid");
        
        return fundsByOwner[_owner];
    }

    function listFundsByMember(address _member) view external returns (address[] memory) {
        require(_member != address(0), "Member invalid");
        
        return fundsByMember[_member];     
    }

    function closeFund(address _fundAddr) external {
        require(_fundAddr != address(0), "Fund address is invalid");

        ICommFund fund = ICommFund(_fundAddr);
        //loop through the fund members and remove this fund from their mappings
        address[] memory members = fund.listMembers();

        for(uint i=0;i<members.length;i++) {
            address[] storage funds = fundsByMember[members[i]];
            for(uint j=0;j<funds.length;j++) {
                if(funds[j] == _fundAddr) {
                    funds[j] = funds[funds.length - 1];
                    delete funds[funds.length - 1];
                    fundsByMember[members[i]] = funds; 
                    break;
                }
            }
        }

        address owner = fund.owner();

        for(uint i=0;i<activeFunds.length;i++) {
            if(activeFunds[i] == _fundAddr) {
                activeFunds[i] = activeFunds[activeFunds.length - 1];
                delete activeFunds[activeFunds.length - 1];
                //remove elements from the individual mappings
                //loop through funds of the owner and delete this fund
                address[] storage funds = fundsByOwner[owner];
                for(uint j=0;j<funds.length;j++) {
                    if(funds[j] == _fundAddr) {
                        funds[j] = funds[funds.length - 1];
                        delete funds[funds.length - 1];
                        fundsByOwner[owner] = funds;
                        break;
                    }
                }        
                break;
            }
        }
    } 
}