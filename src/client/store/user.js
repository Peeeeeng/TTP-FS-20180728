import axios from 'axios'

const initialUser = {
    userName: '',
    email:'',
    id:'',
    balance: 0
}

// const CREATEUSER = 'CREATEUSER'
const SETUSER = 'SETUSER'

// const createUser = (user) => {
//     return {
//         type: CREATEUSER,
//         user
//     }
// }

const setUser = (user) => {
    return {
        type: SETUSER,
        user
    }
}

export const thunkCreateUser = (user) => {
    return async (dispatch) => {
        const { userName, email, password } = user
        const newUser = {
            userName,
            email,
            password
        }
        axios.post(`/api/user`, newUser)
                .then((rUser) => {
                    dispatch(setUser(rUser.data))
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

export const thunkLogin = (user) => {
    return async (dispatch) => {
        const { email, password } = user
        const newUser = {
            email,
            password
        }
        axios.put(`/api/user/login`, newUser)
                .then((rUser) => {
                    dispatch(setUser(rUser.data))
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

export const thunkVarifyUser = () => {
    return async (dispatch) => {
        axios.get('/api/user/varify')
                .then((rUser) => {
                    dispatch(setUser(rUser.data))
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

const reducer = (state = initialUser, action) => {
    switch(action.type){
        case SETUSER:
            const { userName, email, id, balance } = action.user
            return {...state, userName, email, id, balance}
        default:
            return state
    }
}

export default reducer