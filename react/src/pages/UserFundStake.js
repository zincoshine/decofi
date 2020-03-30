import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Heading, Box, Button, Card, Flex, Text, Progress, Select, Field} from "rimble-ui";
import { connect } from 'react-redux';

import { stakeDaiAction, syncDaiTransactionsAction } from 'actions/web3Actions';
import TransactionsCard from 'components/TransactionsCard';
import ContractList from 'components/ContractList';

class UserFundStake extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            fundName: '',
            contractAddress: '',
            periodTerm: 1,
            amount: 0,
        }
    }

    componentDidMount() {
        const {contracts, adminContracts } = this.props;
        let allContracts = [];
        if(contracts.length > 0){
            allContracts = contracts;
        } else if (adminContracts.length > 0){
            allContracts = adminContracts;
        }
        this.props.syncDaiApprovals(adminContracts[0].contractAddress);
        this.setState({
            ...adminContracts[0],
        })
    }

    submitMonthlyStake() {
        const { amount, contractAddress } = this.state;
        this.props.stakeDai(amount, contractAddress);
    };

    onContractChange = (item) => {
        this.setState({
            ...item,
        });
        this.props.syncDaiApprovals(item.contractAddress);
    };

    render() {
        const { transactions, contracts, adminContracts } = this.props;
        let allContracts = [];
        if(contracts.length > 0){
            allContracts = contracts;
        } else if (adminContracts.length > 0){
            allContracts = adminContracts;
        }
        return (
            <Box>
                <Card maxWidth={'640px'} mx={'auto'} p={3} px={4}>
                    <Box mx={"auto"} px={[3, 3, 4]}>
                        <Heading>Monthly Fund Stake</Heading>
                        <Box px={3} mb={15}>
                            <ContractList
                                onChange={this.onContractChange}
                                contracts={adminContracts}
                            />
                        </Box>
                        <Box px={3} mb={15}>
                            <Progress style={{width:"100%"}} value={transactions.length/this.state.periodTerm}/>
                        </Box>
                        <Box px={3}>
                            <Text mb={4}>
                                The monthly fund membership stake is now available.
                                Please Submit your Stake of {this.state.amount} DAI.
                                After the transaction has been executed,
                                you will be able to see the winnings each month of the active community fund {this.state.fundName}.
                                Best of Luck !
                            </Text>
                        </Box>

                    </Box>
                    <Flex justifyContent="center">
                        <Button onClick={() => this.submitMonthlyStake()}>Submit Stake</Button>
                    </Flex>
                </Card>
                <TransactionsCard transactions={this.props.transactions}/>
            </Box>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    stakeDai: (address, value) => dispatch(stakeDaiAction(address, value)),
    syncDaiApprovals: (address) => dispatch(syncDaiTransactionsAction(address)),
});

const mapStateToProps = ({
    web3Reducer: {
        account,
    },
    decofiUserReducer: {
        monthlyStakeTransactions: transactions,
        contracts,
    },
    decofiAdminReducer: {
         contracts: adminContracts,
    }
}) => ({
    account,
    transactions,
    contracts,
    adminContracts,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserFundStake));
