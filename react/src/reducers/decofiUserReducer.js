const initialState = {
    contracts: [],
    monthlyStakeTransactions: [],
};

export function updateMonthlyStakeTransactions(data) {
    return {
        type: "UPDATE_MONTHLY_STAKES",
        payload: data
    };
}

export function updateContractSubs(data) {
    return {
        type: "UPDATE_CONTRACT_SUBS",
        payload: data
    };
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_MONTHLY_STAKES":
            return {
                ...state,
                monthlyStakeTransactions: action.payload,
            };
        case "UPDATE_CONTRACT_SUBS":
            return {
                ...state,
                contracts: action.payload,
            };
        default:
            return state;
    }
};
