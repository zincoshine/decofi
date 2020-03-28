import React, {Component, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {
    Box,
    Flex,
    Button,
    Heading,
    Card,
    Loader,
    EthAddress,
} from "rimble-ui";

import {getMembersAction, getWinnersAction, lotteryPickAction} from 'actions/web3Actions';
import {connect} from "react-redux";
import ContractList from 'components/ContractList';

const CreateForm = (props) => {

    const contract = props.contracts && props.contracts.length > 0 ? props.contracts[0] : null;
    const firstAddress = contract ? contract.contractAddress : null;
    const firstName = contract ? contract.fundName : '';
    const [contractAddress, setContractAddress] = useState(firstAddress);
    const [fundName, setFundName] = useState(firstName);
    const [memberAddresses, setMemberAddresses] = useState([]);
    const [members, setMembers] = useState([]);
    const [winners, setWinners] = useState([]);

    const [pickedAddress, setPickedAddress] = useState('');

    const getMembers = async () => {
        const memberList = await getMembersAction(contractAddress);
        const winnersList = await getWinnersAction(contractAddress);
        setWinners(winnersList);
        setMemberAddresses(memberList);
        setMembers(memberList.map((mem) => {
            return (
                <Box width={[1, 1, 1]} mt={15} px={3}>
                    <EthAddress width={1} address={mem} color={mem === pickedAddress ? 'green' : 'white'}/>
                </Box>
            );
        }));
    };

    const handleClick = () => {
        const theWinner = memberAddresses[Math.floor(Math.random() * memberAddresses.length)];
        if (winners.includes(theWinner)) {
            handleClick();
        } else {
            setPickedAddress(theWinner);
            props.lotteryPick(contractAddress, theWinner)
        }
    };


    const onContractChange = (item) => {
        setContractAddress(item.contractAddress);
        setFundName(item.fundName ? item.fundName : '');
        setWinners([]);
        setMemberAddresses([]);
        setPickedAddress('');
        setMembers([]);
    };

    return (
        <Card maxWidth={'640px'} mx={'auto'} p={3} px={4} mb={'150px'}>
            <Heading>Pick a lottery winner: {fundName}</Heading>
            <Box px={3}>
                <ContractList
                    onChange={onContractChange}
                    contracts={props.contracts}
                />
            </Box>
            <hr/>
            {!!pickedAddress &&
            <Box p={4}>
                <h4>The winner is : </h4>
                <Box color={'greenyellow'} width={[1, 1, 1]} mt={15} px={3}>
                    <EthAddress width={1} address={pickedAddress}/>
                </Box>
            </Box>
            }
            {!pickedAddress &&
            <Box p={4}>
                <Box width={[1, 1, 1]} mt={20} px={3}>
                    <Button onClick={getMembers}>
                        Get Members from Fund
                    </Button>
                </Box>
                <Box width={[1, 1, 1]} mt={20} px={3}>
                    {members}
                </Box>
                <Box width={[1, 1, 1]} mt={20} px={3}>
                    <Button onClick={handleClick}>
                        Pick a Winner
                    </Button>
                </Box>
            </Box>
            }
        </Card>
    );
};

class AdminPickLottery extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <CreateForm {...this.props}/>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    lotteryPick: (contractAddress, winnerAddress) => dispatch(lotteryPickAction(contractAddress, winnerAddress)),
});

const mapStateToProps = (
{
    decofiAdminReducer: {
        contracts,
    }
}) => ({
    contracts,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPickLottery));
