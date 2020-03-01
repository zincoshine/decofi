import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {BaseStyles, Box, Button, Card, Flex, MetaMaskButton} from "rimble-ui";


class Home extends Component {
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
                <Flex>
                    <Box width={[1,1,1]} mb={15} px={3} pl={0}>
                        <MetaMaskButton
                            data-dh-feature="network"
                            data-dh-property-enable="true"
                        >Connect with MetaMask
                        </MetaMaskButton>
                    </Box>
                    <Box width={[1, 1, 1]} mb={15} px={3} pr={0}>
                        <Button onClick={()=>this.menuClick('/admin')}>Admin</Button>
                    </Box>
                </Flex>
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


                    <label >Balance (ETH)</label>
                    <br/>
                    <div
                        data-dh-feature="user"
                        data-dh-property-balance
                        data-dh-modifier-units="ether"
                        data-dh-modifier-decimals="5">
                    </div>

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
                    <Flex>
                        <Box width={[1, 1, 1]} px={3}>
                            <Button onClick={()=>this.menuClick('/user/stake')}>Monthly Stake & Earnings</Button>
                        </Box>
                    </Flex>
                </Card>
            </BaseStyles>
        );
    }
}

export default withRouter(Home);
