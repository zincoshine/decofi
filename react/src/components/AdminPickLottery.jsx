import React, {Component, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {
    Box,
    Flex,
    Button,
    BaseStyles,
    Card,
    Loader,
    EthAddress,
} from "rimble-ui";

import {getMembersAction, getWinnersAction} from 'actions/web3Actions';

const CreateForm = () => {

    const [memberAddresses, setMemberAddresses] = useState([]);
    const [members, setMembers] = useState([]);
    const [winners, setWinners] = useState([]);

    const [pickedAddress, setPickedAddress] = useState('');

    const getMembers = async () => {
        const memberList = await getMembersAction();
        const winnersList = await getWinnersAction();
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
        if(winners.includes(theWinner)){
            handleClick();
        }else{
            setPickedAddress(theWinner);
        }
    };

    return (
        <BaseStyles>
            <Card>
                <h4>Pick a lottery winner</h4>

                <hr/>
                {!!pickedAddress &&
                <Box p={4}>
                    <h4>The winner is : </h4>
                    <Box color={'greenyellow'} width={[1, 1, 1]} mt={15} px={3}>
                        <EthAddress width={1} address={pickedAddress}/>
                        <div
                            data-dh-feature="customContract"
                            data-dh-property-contract-name="decofi"
                            data-dh-property-method-name="lottery"
                            data-dh-property-method-id="lottery"
                            data-dh-property-eth-value="0"
                            data-dh-property-auto-invoke="true"
                        >
                        </div>

                        <input
                            data-dh-property-method-id="lottery"
                            data-dh-property-input-name="address"
                            value={pickedAddress}
                            hidden={true}
                            readOnly={true}
                        />

                        <div
                            data-dh-property-method-id="lottery"
                            data-dh-property-output-name=""
                            data-dh-property-outputs="true"
                        >
                        </div>
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
        </BaseStyles>
    );
};

class AdminPickLottery extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <CreateForm/>
        );
    }
}

export default withRouter(AdminPickLottery);
