import React, { Component } from 'react'
import { connect } from 'react-redux'
import { thunkLogin } from '../store/user'

class LogIn extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    async handleSubmit(evt){
        evt.preventDefault()
        const user = {
            email: evt.target.email.value,
            password: evt.target.password.value
        }
        let res = await this.props.userLogIn(user)
        console.log(res)
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type='text' name='email' />
                </div>
                <div>
                    <label>Password</label>
                    <input type='text' name='password' />
                </div>
                <button type='submit'>Log In</button>
                <button type='button'>Cancel</button>
            </form>
        )
    }
}

const mapDispatch = (dispatch) => {
    return {
        userLogIn: (user) => dispatch(thunkLogin(user))
    }
}

export default connect(null, mapDispatch)(LogIn)