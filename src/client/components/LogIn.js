import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
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
        this.props.history.push('/')
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
            <caption>User LogIn</caption>
            <table className='form_table'>
                <tbody>
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

export default withRouter(connect(null, mapDispatch)(LogIn))