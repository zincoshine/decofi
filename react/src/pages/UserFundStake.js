import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Heading, Box, Button, Card, Flex, Text, Progress} from "rimble-ui";
import { connect } from 'react-redux';

import { stakeDaiAction } from 'actions/web3Actions';
import TransactionsCard from 'components/TransactionsCard';

class UserFundStake extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    submitMonthlyStake() {
        this.props.stakeDai(1);
    };

    render() {
        const { transactions } = this.props;
        return (
            <Box>
                <Card maxWidth={'640px'} mx={'auto'} p={3} px={4}>
                    <Box mx={"auto"} px={[3, 3, 4]}>
                        <Progress style={{width:"100%"}} value={transactions.length/24}/>
                        <Heading>Monthly Fund Stake</Heading>
                        <Box>
                            <Text mb={4}>
                                The monthly fund membership stake is now available. Please Submit your Stake of 1000 DAI.
                                After the transaction has been executed,
                                you will be able to see the winnings each month of the active community fund.
                                Best of Luck !
                            </Text>
                        </Box>

                    </Box>
                    <Flex justifyContent="center">
                        <Button onClick={() => this.submitMonthlyStake()}>Submit Stake</Button>
                    </Flex>
                </Card>
                <TransactionsCard/>
            </Box>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    stakeDai: (address, value) => dispatch(stakeDaiAction(address, value)),
});

const mapStateToProps = ({
    web3Reducer: {
        account,
    },
    decofiUserReducer: {
        monthlyStakeTransactions: transactions,
    }
}) => ({
    account,
    transactions,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserFundStake));
