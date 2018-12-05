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
            const res = await axios.get(`/api/user/stock/transaction`)
            dispatch(getTrans(res.data))
        } catch (err) {
            console.errors(err)
            return err
        }
    }
}

export const thunkCreateTrans = (trans) => {
    return async dispatch => {
        axios.post(`/api/user/stock/transaction`, trans)
                .then((res) => {
                    // there might be another transaction complete in different place under same account
                    console.log('This is create trans')
                    console.log(res)
                    dispatch(thunkGetTrans())
                    dispatch(thunkGetHoldings())
                })
                .catch((err) => {
                    // console.log('Create trans error occured')
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