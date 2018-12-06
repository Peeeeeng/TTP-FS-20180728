import axios from 'axios'
import { thunkGetHoldings } from './holdings'
import { thunkVarifyUser } from './user'
import { setNote } from './notification'

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
            console.error(err)
            return err
        }
    }
}

export const thunkCreateTrans = (trans) => {
    return async dispatch => {
        axios.post(`/api/user/stock/transaction`, trans)
                .then((res) => {
                    // there might be another transaction complete in different place under same account
                    console.log('This is creating trans')
                    console.log(res)
                    dispatch(thunkGetTrans())
                    dispatch(thunkGetHoldings())
                    dispatch(thunkVarifyUser())
                    return res
                })
                .catch((err) => {
                    // console.log('Create trans error occured')
                    if (err.response.status == 404) {
                        dispatch(setNote('Symbold is incorrect.'))
                    } else if (err.response.status == 403) {
                        if(trans.activity === 'BUY'){
                            dispatch(setNote('There is not have enough balance.'))
                        } else if (trans.activity === 'SELL'){
                            dispatch(setNote('You are selling more than you have.'))
                        } else {
                            dispatch(setNote(err.message))
                        }
                    } else {
                        dispatch(setNote(err.message))
                    }
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