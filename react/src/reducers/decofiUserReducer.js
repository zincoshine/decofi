const initialState = {
    monthlyStakeTransactions: [],
};

export function updateMonthlyStakeTransactions(data) {
    return {
        type: "UPDATE_MONTHLY_STAKES",
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
        default:
            return state;
    }
};
