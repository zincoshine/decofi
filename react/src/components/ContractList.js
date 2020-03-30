import React from "react";
import { Flex, Box, Text, Blockie, QR } from "rimble-ui";
import { DropdownList } from 'react-widgets';

const ContractListItem = ({item}) => {
  const {
    contractAddress = '',
    fundName = '',
    numberOfPeople,
    periodTerm,
    amount,
    asset = "DAI",
  } = item;
  return (
      <Flex alignItems={"flex-start"}>
        <Box>
          <Text.span fontSize={1} color={'mid-gray'}>
            Contract Address:
            <div style={{wordBreak: 'break-word'}}>
              {contractAddress}
            </div>
          </Text.span>
          <Text fontSize={1} color={'mid-gray'}>
            Contract Name: {fundName}
          </Text>
          <Text fontSize={1} color={'mid-gray'}>
            Stake Token: {asset}
          </Text>
          <Text fontSize={1} color={'mid-gray'}>
            Members : {numberOfPeople}
          </Text>
          <Text fontSize={1} color={'mid-gray'}>
            Term Length: {periodTerm} months
          </Text>
          <Text fontSize={1} color={'mid-gray'}>
            Monthly stake amount: {amount} {asset}
          </Text>
        </Box>
      </Flex>
  );
};

class ContractList extends React.Component {

  constructor(props){
    super(props);
  }

  changeEvent = (item) => {
    this.props.onChange(item);
  };

  render() {
    return (
        <DropdownList
            data={this.props.contracts}
            defaultValue={this.props.contracts.length > 0 ? this.props.contracts[0] : null}
            onSelect={this.changeEvent}
            textField={'contractAddress'}
            valueField={'contractAddress'}
            itemComponent={ContractListItem}
        />
    );
  }
}

export default ContractList;
