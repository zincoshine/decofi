import React from "react";
import { Box, Heading } from "rimble-ui";

class Header extends React.Component {
  render() {
    return (
      <Box bg="primary" p={3} justifyContent="center" flexDirection="column">
        <Box justifyContent="center" maxWidth="400px" mx="auto">
          <Heading fontSize={3} color={"white"}>Decentralized Community Financing</Heading>
        </Box>
      </Box>
    );
  }
}

export default Header;
