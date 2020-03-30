import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Flex, Box, Button} from "rimble-ui";

class MainMenu extends Component {

    menuClick = (path) => {
        this.props.history.push(path);
    };

    render() {
        return (
            <Box>
                <Flex justifyContent={"center"} mt={"15px"}>
                    <Box px={3}>
                        <Button onClick={()=>this.menuClick('/')}>Home</Button>
                    </Box>
                    <Box px={3}>
                        <Button onClick={()=>this.menuClick('/user/stake')}>Fund Membership</Button>
                    </Box>
                    <Box px={3}>
                        <Button onClick={()=>this.menuClick('/admin')}>Manage Community Fund</Button>
                    </Box>
                </Flex>
            </Box>
        );
    }
}

export default withRouter(MainMenu);
