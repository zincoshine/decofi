import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Box, Button, Card, Flex, Heading, Text} from "rimble-ui";

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
            <Card maxWidth={'640px'} mx={'auto'} mb={'150px'} p={3} px={4}>
                <Flex justifyContent={'center'} flexDirection={"column"}>
                    <Box px={3}>
                        <Heading>Create new Fund</Heading>
                        <Box>
                            <Text mb={4}>
                                Create a New Community Financing and invite user addresses to be the members of the Fund.
                            </Text>
                        </Box>
                        <Button onClick={()=>this.menuClick('/admin/createfund')}>New Community Fund</Button>
                    </Box>
                    <Box px={3}>
                        <Heading>Draw the Winner</Heading>
                        <Box>
                            <Text mb={4}>
                                Every month there is a winner and all members of the Fund are the winners with a
                                randomly selected address every month.
                            </Text>
                        </Box>
                        <Button onClick={()=>this.menuClick('/admin/lottery')}>Pick a Winner</Button>
                    </Box>
                    <Box px={3} mb={"20px"}>
                        <Heading>Analytics</Heading>
                        <Box>
                            <Text mb={4}>
                                Soon Available. Check how much DAI is earned in interest and the share each member
                                of the Fund will earn.
                            </Text>
                        </Box>
                        <Button onClick={()=>this.menuClick('/admin/analytics')}>Analytics</Button>
                    </Box>
                </Flex>
            </Card>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    stakeDai: (address, value) => dispatch(stakeDaiAction(address, value)),
});

const mapStateToProps = ({
    decofiAdminReducer: {
     contracts,
    }
}) => ({
    contracts,
});

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Admin));
