import Web3 from 'web3'
import { updateMonthlyStakeTransactions, updateContractSubs } from "reducers/decofiUserReducer";
import { createNewContractAction, addContractMembers, addContractWinner, updateDeployedContracts } from "reducers/decofiAdminReducer";

const SocialFundABI = require('abis/CommFund.json');
const DAIABI = require('abis/DAI.json');

const web3Factory = () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    return web3;
};

export const getAllContractsForAddress = (address) => {
    return async (dispatch, getState) => {
        const web3 = web3Factory();
        web3.eth.getPastLogs({
            fromBlock: "earliest",
            toBlock: "latest",
            topics: [
                '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
                null,
                address.replace("0x", '0x000000000000000000000000'),
            ],
        }).then(async results => {
            const promises = results.map((result) => {
                return web3.eth.getTransaction(result.transactionHash).then(tx => {
                    return Promise.resolve(tx);
                }).catch(er => {
                    console.log(er);
                });
            });
            const contractDeployments = await Promise.all(promises);
            const finalList = contractDeployments ?
                contractDeployments.filter((txs) => {
                    return txs.creates && txs.input.startsWith(SocialFundABI["bytecode"]);
                }).map(fintx => {
                    return {
                        contractAddress: fintx.creates,
                    }
                }) :
                [];
            dispatch(updateDeployedContracts(finalList));
            dispatch(updateContractSubs(finalList));
        }).catch(e => {
            console.log("ERROR GETTING TRANSACTIONS", e);
        })
    };
};

export const getAllTransactionsFromContract = async (contractAddress, targetAddress) => {
    const web3 = web3Factory();
    return web3.eth.getPastLogs({
        fromBlock: "earliest",
        toBlock: "latest",
        address: contractAddress,
        topics: [
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            web3.currentProvider.selectedAddress.replace("0x", '0x000000000000000000000000'),
            targetAddress.replace("0x", '0x000000000000000000000000'),
        ],
    }).then(async results => {
        const promises = results.map(async (result) => {
            const blockNumber = await web3.eth.getBlockNumber().then(x => x).catch(() => 0);
            return web3.eth.getTransaction(result.transactionHash).then(tx => {
                const confirmations = blockNumber > 0 ? blockNumber - tx.blockNumber : 0;
                return Promise.resolve({...tx, confirmations});
            }).catch(er => {
                console.log(er);
                return Promise.resolve({...result, error: true});
            });
        });
        return Promise.all(promises);
    }).catch(e => {
        console.log("ERROR GETTING TRANSACTIONS", e);
        return [];
    })
};

export const deploySocialFundContract = (contractParams, navigator) => {
    return (dispatch, getState) => {
        const web3 = web3Factory();
        const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

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
        }).then(newContract => {
            console.log("New Contract Object", newContract);
            console.log("New Contract Address", newContract.options.address);// instance with the new contract address
            dispatch(createNewContractAction({...contractParams, contractAddress: newContract.options.address}));
            navigator.push('/admin/addmembers', {...contractParams, contractAddress: newContract.options.address});
        }).catch(e => {
            console.log("Deploy contract error", e);
        })

        //navigator.push('/admin')
    }
};

export const addMembersAction = (contractAddress, addressList, navigator) => {
    return (dispatch, getState) => {
        const web3 = web3Factory();

        const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], contractAddress);

        if(addressList.length === 1){
            socFundContract.methods.addMember(addressList[0]).send({
                from: web3.currentProvider.selectedAddress,
            }).then(receipt => {
                dispatch(addContractMembers(contractAddress, [...addressList]));
                navigator.push('/admin', {...navigator.location.state, addressList});
            }).catch(e => {
                console.log("Add Member Error", e);
            })
        } else {
            socFundContract.methods.addMembers(addressList).send({
                from: web3.currentProvider.selectedAddress,
            }).then(receipt => {
                dispatch(addContractMembers(contractAddress, [...addressList]));
                navigator.push('/admin', {...navigator.location.state, addressList});
            }).catch(e => {
                console.log("Add Members Error", e);
            })
        }

        //navigator.push('/admin')
    }
};

export const lotteryPickAction = (contractAddress, winnerAddress) => {
    return (dispatch, getState) => {
        const web3 = web3Factory();

        const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], contractAddress);

        socFundContract.methods.lottery(winnerAddress).send({
            from: web3.currentProvider.selectedAddress,
        }).then(receipt => {
            dispatch(addContractWinner(contractAddress, winnerAddress));
        }).catch(e => {
            console.log("Lottery pick error", e);
        })
    }
};

export const getMembersAction = async (contractAddress) => {
    const web3 = web3Factory();

    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], contractAddress);

    return socFundContract.methods.listMembers().call().then(members => {
        return members;
    }).catch(e => {
        console.log('action call error', e);
        return [
            '0x3d28c179A51465E545b07efE5a96593b6E8d0731',
            '0x3d28c179A51465E545b07efE5a96593b6E8d0732',
            '0xf00715BE00827789C086053Bb66E27ea7DF2f23c',
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

export const getWinnersAction = async (contractAddress) => {
    const web3 = web3Factory();

    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], contractAddress);

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
    } catch (e) {
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

export const getDaiBalanceAction = async () => {
    const web3 = web3Factory();

    const daiContract = new web3.eth.Contract(DAIABI["abi"], '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD');
    try {
        return daiContract.methods.balanceOf(web3.currentProvider.selectedAddress).call().then(balanceWei => {
            let balance = web3.utils.fromWei(
                balanceWei,
                "ether"
            );
            balance = parseFloat(balance);
            return balance;
        }).catch(e => {
            console.log('action call error', e);
        });
    } catch (e) {
        console.error('Error fetchinng DAI balance', e);
    }
    return 0;
};

export const getCurrentWinnerAction = async () => {
    const web3 = web3Factory();

    const socFundContract = new web3.eth.Contract(SocialFundABI["abi"], '0xb7c7e45Ef6a8D46135BB519CDA1fFBeEF4845122');

    try {
        return socFundContract.methods.currentWinner().call().then(currentWinnerAddress => {
            return currentWinnerAddress;
        }).catch(e => {
            console.log('action call error', e);
            return Promise.resolve('0x3d28c179A51465E545b07efE5a96593b6E8d0731')
        });
    } catch (e) {
        return Promise.resolve('0x3d28c179A51465E545b07efE5a96593b6E8d0731')
    }
};

export const syncDaiTransactionsAction = (contractAddress) => {
    return async (dispatch, getState) => {
        const {
            decofiUserReducer: {
                monthlyStakeTransactions = [],
            }
        } = getState();
        const transactions = await getAllTransactionsFromContract('0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', contractAddress);
        const allDaiTransactions = transactions.filter(x => x.error !== true);
        const results = [];
        allDaiTransactions.forEach(adt => {
            const status = adt.confirmations > 6 ? "confirmed" : "pending";
            const method = "DAI Stake";
            const mst = monthlyStakeTransactions.find(tx => tx.hash === adt.hash);
            if (mst) {
                if (mst.status !== status || mst.confirmations !== adt.confirmations) {
                    results.push({...mst, ...adt, lastUpdated: Date.now(), status, method});
                } else if (!mst.created) {
                    results.push({...mst, ...adt, created: Date.now(), lastUpdated: Date.now(), status, method});
                }
            } else {
                results.push({...adt, created: Date.now(), lastUpdated: Date.now(), status, method})
            }
        });
        dispatch(updateMonthlyStakeTransactions(results));
    }
};

export const stakeDaiAction = (value, contractAddress) => {
    return (dispatch, getState) => {
        const web3 = web3Factory();

        const daiContract = new web3.eth.Contract(DAIABI["abi"], '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD');

        daiContract.methods.approve(contractAddress, web3.utils.toWei(value.toString(), "ether")
        ).send({
            from: web3.currentProvider.selectedAddress,
        }).then(async receipt => {
            dispatch(syncDaiTransactionsAction(contractAddress))
        }).catch(e => {
            console.log("STAKE DAI ERROR", e);
        });
    }
};
