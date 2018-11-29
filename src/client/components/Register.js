import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { thunkCreateUser } from '../store/user'

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
        let res = await this.props.userRegister(user)
        console.log(res)
        this.props.history.push('/')
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <caption>Register User</caption>
                <table className='form_table'>
                    <tbody>
                    <tr>
                        <th>
                        <input type='text' name='userName' placeholder='User Name' />
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <input type='text' name='email' placeholder='Email' />
                        </th>
                    </tr>
                    <tr>
                        <th>
                        <input type='password' name='password' placeholder='Password'/>
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

const mapDispatch = (dispatch) => {
    return {
        userRegister: (user) => dispatch(thunkCreateUser(user))
    }
}

export default withRouter(connect(null, mapDispatch)(Register))