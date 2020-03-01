import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {BaseStyles, Box, Button, Card, Flex, MetaMaskButton} from "rimble-ui";


class UserFundStake extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    menuClick = (path) => {
        this.props.history.push(path);
    };

    render() {
        return (
            <BaseStyles>
                <MetaMaskButton
                    data-dh-feature="network"
                    data-dh-property-enable="true"
                >Connect with MetaMask
                </MetaMaskButton>
                <Card>
                    <Box width={[1,1,1]} px={3}>

                        <label>Network Name</label>
                        <br/>
                        <div data-dh-feature="network" data-dh-property-name="true"
                             className="text"/>

                        <hr/>


                        <label>Address</label>
                        <br/>
                        <div data-dh-feature="user" data-dh-property-address="true"
                             className="text"/>

                        <hr/>

                        <label>Balance (DAI)</label>
                        <br/>
                        <div
                            data-dh-feature="customContract"
                            data-dh-property-contract-name="dai"
                            data-dh-property-method-name="balanceOf"
                            data-dh-property-method-id="daiBalance"
                            data-dh-property-eth-value="0"
                            data-dh-property-auto-invoke="true"
                        >
                        </div>

                        <input
                            data-dh-property-method-id="daiBalance"
                            data-dh-property-input-name="_owner"
                            value="$CURRENT_USER"
                            hidden={true}
                            readOnly={true}
                        />

                        <div
                            data-dh-property-method-id="daiBalance"
                            data-dh-property-outputs="true"
                            data-dh-modifier-display-units="ether"
                            data-dh-modifier-contract-units="wei"
                            data-dh-modifier-decimals="5"
                        >
                        </div>
                    </Box>
                </Card>
                <Card>
                    <Box width={[1,1,1]} px={3}>
                        <label>Current Winner Address</label>
                        <br/>
                        <div
                            data-dh-feature="customContract"
                            data-dh-property-contract-name="decofi"
                            data-dh-property-method-name="currentWinner"
                            data-dh-property-method-id="currentWinner"
                            data-dh-property-eth-value="0"
                            data-dh-property-auto-invoke="true"
                        >
                        </div>

                        <div
                            data-dh-property-method-id="currentWinner"
                            data-dh-property-output-name=""
                            data-dh-modifier-display-units="string"
                            data-dh-modifier-contract-units="string"
                            data-dh-property-outputs="true"
                        >
                            No earnings yet...
                        </div>

                    </Box>
                </Card>
                <Card>
                    <Box width={[1,1,1]} px={3}>
                        <label>Stake the Monthly 1000 DAI</label>
                        <br/>
                        <div
                            data-dh-feature="customContract"
                            data-dh-property-contract-name="dai"
                            data-dh-property-method-name="approve"
                            data-dh-property-method-id="approveDai"
                            data-dh-property-eth-value="0"
                        >
                        </div>


                        <input
                            data-dh-property-method-id="approveDai"
                            data-dh-property-input-name="_spender"
                            value="0x1dafc8be4f16555441cb2636abd07445b5907ae4"
                            hidden={true}
                            readOnly={true}
                        />

                        <input
                            data-dh-property-method-id="approveDai"
                            data-dh-property-input-name="_value"
                            value={1000}
                            hidden={true}
                            readOnly={true}
                        />

                        <div
                            data-dh-property-method-id="approveDai"
                            data-dh-property-outputs="true"
                        >
                        </div>

                        <Flex>
                            <Box width={[1, 1, 1]} mt={20} mb={20} px={3}>
                                <Button
                                    data-dh-property-method-id="approveDai"
                                    data-dh-property-invoke="true">
                                    Submit Stake
                                </Button>
                            </Box>
                        </Flex>
                        <hr/>

                    </Box>
                </Card>
                <Card>
                    <Flex>
                        <Box width={[1, 1, 1]} px={3}>
                            <Button onClick={()=>this.menuClick('/')}>Monthly Stake & Earnings</Button>
                        </Box>
                    </Flex>
                </Card>
            </BaseStyles>
        );
    }
}

export default withRouter(UserFundStake);
