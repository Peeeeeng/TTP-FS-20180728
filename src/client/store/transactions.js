import axios from 'axios'
import { thunkGetHoldings } from './holdings'

const initialTransactions = {transactions: []}

const GETTRANS = 'GETTRANS'
const CREATETRANS = 'CREATETRANS'

const getTrans = trans => ({ type: GETTRANS, trans})
// const createTrans = trans => ({ type: CREATETRANS, trans})

export const thunkGetTrans = () => {
    return async dispatch => {
        try{
            const res = await axios.get(`/api/user/stock/transaction/1`)
            dispatch(getTrans(res.data))
        } catch (err) {
            console.errors(err)
            return err
        }
    }
}

export const thunkCreateTrans = (trans) => {
    return async dispatch => {
        axios.post(`/api/user/stock/transaction/1`, trans)
                .then((res) => {
                    // there might be another transaction complete in different place under same account
                    dispatch(thunkGetTrans())
                    dispatch(thunkGetHoldings())
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

export default function (state = initialTransactions, action){
    switch(action.type){
        case GETTRANS:
            return { ...state, transactions: action.trans.slice() }
        default:
            return state
    }
}