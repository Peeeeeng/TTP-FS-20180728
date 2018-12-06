import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { thunkCreateUser } from '../store/user'
import { setNote, clearNote } from '../store/notification'

class Register extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    async handleSubmit(evt){
        evt.preventDefault()
        const user = {
            userName: evt.target.userName.value,
            email: evt.target.email.value,
            password: evt.target.password.value
        }
        let userName = user.userName.split(' ').join('')
        let email = user.email.split(' ').join('')
        let password = user.password.split(' ').join('')
        if(!userName){
            setNote('User Name can not be empty.')
        } else if(!email) {
            setNote('Email can not be empty.')
        } else if(!password) {
            setNote('Password can not be empty.')
        } else {
            let res = await this.props.userRegister(user)
            clearNote()
            console.log(res)
            this.props.history.push('/')
        }
    }

    handleChange(evt){
        if(this.props.tip){
            this.props.clearNote()
        }
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <caption>Register User</caption>
                <table className='form_table'>
                    <tbody>
                    <tr>
                        <th>
                        <input type='text' name='userName' placeholder='User Name' onChange={this.handleChange} />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <input type='email' name='email' placeholder='Email' onChange={this.handleChange} />
                        </th>
                    </tr>
                    <tr>
                        <th>
                        <input type='password' name='password' placeholder='Password' onChange={this.handleChange} />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <font color='red'>{this.props.tip}</font>
                        </th>
                    </tr>
                    </tbody>
                </table>
                    <button type='submit'>Register!</button>
                    <button type='button'>Cancel</button>
                </form>
        )
    }
}

const mapState = (state) => {
    return {
        tip: state.notification.tip,
    }
}

const mapDispatch = (dispatch) => {
    return {
        userRegister: (user) => dispatch(thunkCreateUser(user)),
        setNote: (tip) => dispatch(setNote(tip)),
        clearNote: () => dispatch(clearNote())
    }
}

export default withRouter(connect(mapState, mapDispatch)(Register))