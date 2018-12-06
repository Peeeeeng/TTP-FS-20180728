

const initialNotfication = {
    tip: ''
}

const SETNOTE = 'SETNOTE'
const CLEARNOTE = 'CLEARNOTE'

export const setNote = (tip) => {
    return {
        type: SETNOTE,
        tip
    }
}

export const clearNote = () => {
    return {
        type: CLEARNOTE,
        tip: ''
    }
}

export default function (state = initialNotfication, action){
    const { tip } = action
    switch (action.type){
        case SETNOTE:
            return {...state, tip}
        case CLEARNOTE:
            return {...state, tip}
        default:
            return state

    }
}