const initialState = {
    contract: {},
    account: null,
    accountBalance: null,
    accountBalanceLow: null,
    transactions: {},
    accountValidated: null,
    daiBalance: null,
};

export function updateWeb3Action(data) {
    return {
        type: "UPDATE_WEB3",
        payload: data
    };
}

export default (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_WEB3":
            const {
                account,
                accountBalance,
                accountBalanceLow,
                transactions,
                accountValidated,
                daiBalance,
            } = action.payload;
            return {
                ...state,
                account,
                accountBalance,
                accountBalanceLow,
                transactions,
                accountValidated,
                daiBalance,
            };
        default:
            return state;
    }
};
