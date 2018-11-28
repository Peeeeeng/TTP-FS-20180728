import axios from 'axios'

const initialUser = {
    userName: '',
    email:'',
    id:'',
    balance: 0
}

const CREATEUSER = 'CREATEUSER'

const createUser = (user) => {
    return {
        type: CREATEUSER,
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
                    dispatch(createUser(rUser.data))
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
    }
}

const reducer = (state = initialUser, action) => {
    switch(action.type){
        case CREATEUSER:
            const { userName, email, id, balance } = action.user
            return {...state, userName, email, id, balance}
        default:
            return state
    }
}

export default reducer