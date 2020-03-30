import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Flex, Box, Button} from "rimble-ui";

class Home extends Component {

    menuClick = (path) => {
        this.props.history.push(path);
    };

    render() {
        return null;
    }
}

export default withRouter(Home);
