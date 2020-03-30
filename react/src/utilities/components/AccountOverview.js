import React from "react";
import { Flex, Box, Text, Blockie, QR } from "rimble-ui";

class AccountOverview extends React.Component {

  constructor(props){
    super(props);
  }

  trimEth = eth => {
    eth = parseFloat(eth);
    eth = eth * 10000;
    eth = Math.round(eth);
    eth = eth / 10000;
    eth = eth.toFixed(4);

    return eth;
  };

  render() {
    const roundedBalance = this.trimEth(this.props.accountBalance);
    const roundedDaiBalance = this.trimEth(this.props.daiBalance);
    return (
      <Flex alignItems={"flex-start"}>
        <Flex mr={3}>
          <Flex border={1} borderColor={'moon-gray'} p={1}>
            <QR
              value={this.props.account}
              size={64}
              renderAs={'svg'}
            />
          </Flex>
        </Flex>
        <Box>
          <Text.span fontSize={1} color={'mid-gray'}>
            Public Address:
            <div style={{wordBreak: 'break-word'}}>
              {this.props.account}
            </div>
          </Text.span>
          <Text
              fontSize={1}
              color={'mid-gray'}
          >
            Balance DAI: {roundedDaiBalance}
          </Text>
          <Text
            fontSize={1}
            color={this.props.accountBalanceLow ? 'red' : 'mid-gray'}
            >
              Balance ETH: {roundedBalance}
          </Text>
        </Box>
      </Flex>
    );
  }
}

export default AccountOverview;
