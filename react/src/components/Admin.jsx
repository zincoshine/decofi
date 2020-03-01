import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {BaseStyles, Box, Button, Card, EthAddress, Flex, Form, Heading, MetaMaskButton, Text} from "rimble-ui";

class Admin extends Component {
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
                <Card>
                        <Box width={[1, 1, 1]} px={3}>
                            <h4>Welcome Admin !</h4>
                        </Box>
                        <Box width={[1, 1, 1]} mt={20} px={3}>
                            <MetaMaskButton
                                data-dh-feature="network"
                                data-dh-property-enable="true"
                            >Connect with MetaMask
                            </MetaMaskButton>
                        </Box>

                </Card>
                <Card>
                    <Flex>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button onClick={()=>this.menuClick('/admin/createfund')}>New Community Fund</Button>
                        </Box>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button onClick={()=>this.menuClick('/admin/addmembers')}>Add Community Members</Button>
                        </Box>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button onClick={()=>this.menuClick('/admin/lottery')}>Pick a Winner</Button>
                        </Box>
                        <Box width={[1, 1, 1 / 2]} px={3}>
                            <Button onClick={()=>this.menuClick('/admin/analytics')}>Analytics</Button>
                        </Box>
                    </Flex>
                </Card>
                <Card>
                    <Box mt={20} p={4}>
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


                        <label>Balance (ETH)</label>
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
                        <hr/>
                    </Box>
                </Card>
            </BaseStyles>
        );
    }
}

export default withRouter(Admin);
