import axios from 'axios'

const defaultRecord = {records: []}

const UPDATERECORDS = 'UPDATERECORDS'

const updateRecords = newRecords => ({ type: UPDATERECORDS, newRecords})

export const getRecords = () => {
    return async dispatch => {
        try{
            const res = await axios.get('api/record')
            dispatch(updateRecords(res.data))
        } catch (err) {
            console.errors(err)
        }
    }
}

export default function (state = defaultRecord, action){
    switch(action.type){
        case UPDATERECORDS:
            return { ...state, records: action.newRecords }
        default:
            return state
    }
}