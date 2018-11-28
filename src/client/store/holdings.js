import axios from 'axios'

const initialHolding = []

const GETHOLDINGS = 'GETHOLDINGS'

const getHoldings = (holdings) => {
    return {
        type: GETHOLDINGS,
        holdings
    }
}

export const thunkGetHoldings = () => {
    return async (dispatch) => {
        axios.get(`/api/user/stock/1`)
                .then((holdings) => {
                    dispatch(getHoldings(holdings.data))
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

const reducer = (state = initialHolding, action) => {
    switch(action.type){
        case GETHOLDINGS:
            return action.holdings.slice()
        default:
            return state
    }
}

export default reducer