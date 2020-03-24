const initialState = {
    contracts: [],
    contractMembers: [],
    contractWinners: [],
};

export function createNewContractAction(contract) {
    return {
        type: "CREATE_NEW_CONTRACT",
        payload: contract
    };
}

export function addContractMembers(contractAddress, members) {
    return {
        type: "ADD_CONTRACT_MEMBERS",
        payload:  { contractAddress: contractAddress, members: members }
    };
}

export function addContractWinner(contractAddress, winnerAddress) {
    return {
        type: "ADD_CONTRACT_WINNER",
        payload:  { contractAddress: contractAddress, winnerAddress: winnerAddress }
    };
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_NEW_CONTRACT":
            const allContracts = [...state.contracts];
            allContracts.push(action.payload);
            return {
                ...state,
                contracts: allContracts,
            };
        case "ADD_CONTRACT_MEMBERS":
            const allContractMembers = state.contractMembers ? [...state.contractMembers] : [];
            allContractMembers.push(action.payload);
            return {
                ...state,
                contractMembers: allContractMembers,
            };
        case "ADD_CONTRACT_WINNER":
            const allContractWinners = state.contractWinners ? [...state.contractWinners] : [];
            allContractWinners.push(action.payload);
            return {
                ...state,
                contractMembers: allContractWinners,
            };
        default:
            return state;
    }
};
