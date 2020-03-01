import Web3 from 'web3'
const SocialFundABI = require('abis/SocialFund.json');

export const deploySocialFundContract = (contractParams, navigator) => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    console.log("VERSION WEB3", web3.version);


    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

    console.log('SOCFUND CONTRACT OBJECT BEFORE DEPLOYMENT====>>>>', socFundContract);

    socFundContract.deploy({
        data: SocialFundABI["bytecode"],
        arguments: [
            contractParams.fundName,
            contractParams.periodTerm,
            contractParams.numberOfPeople,
            contractParams.amount,
            '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', //DAI TOKEN ADDRESS
        ]
    }).send({
        from: web3.currentProvider.selectedAddress,
        gas: 1500000,
        gasPrice: '30000000000000'
    }).then(newContract => {
        console.log("New Contract Object", newContract);
        console.log("New Contract Address", newContract.options.address);// instance with the new contract address
        navigator.push('/admin/addmembers', {...contractParams, contractAddress: newContract.options.address});
    }).catch(e => {
        console.log("Deploy contract error", e);
        navigator.push('/admin/addmembers', {...contractParams, contractAddress: '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122'});
    })

    //navigator.push('/admin')
};

export const addMembersAction = (addressList, navigator) => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    console.log("VERSION WEB3", web3.version);


    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

    console.log('SOCFUND CONTRACT OBJECT BEFORE DEPLOYMENT====>>>>', socFundContract);

    socFundContract.methods.addMembers(addressList).send({
        from: web3.currentProvider.selectedAddress,
    }).then(receipt => {
        console.log("Successfully added members ", addressList);
        navigator.push('/admin', {...navigator.location.state, addressList});
    }).catch(e => {
        console.log("Deploy contract error", e);
        navigator.push('/admin', {...navigator.location.state, addressList});
    })

    //navigator.push('/admin')
};

export const getMembersAction = async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    console.log("VERSION WEB3", web3.version);


    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

    return socFundContract.methods.listMembers().call().then(members => {
        return members;
    }).catch(e => {
        console.log('action call error',e);
        return [
            '0x3d28c179A51465E545b07efE5a96593b6E8d0731',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0732',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0733',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0734',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0735',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0736',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0737',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0738',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
        ];
    });
};

export const getWinnersAction = async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    console.log("VERSION WEB3", web3.version);


    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

    try {
        return socFundContract.methods.listWinners().call().then(members => {
            return members;
        }).catch(e => {
            console.log('action call error', e);
            return [
                '0x3d28c179A51465E545b07efE5a96593b6E8d0731',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0732',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0734',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0735',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0736',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0737',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0738',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
                '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
            ];
        });
    }catch(e) {
        return Promise.resolve([
            '0x3d28c179A51465E545b07efE5a96593b6E8d0731',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0732',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0734',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0735',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0736',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0737',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0738',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0739',
        ])
    }
};
