import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { thunkLogin } from '../store/user'

class LogIn extends Component {
    constructor(props){
        super(props)
        this.state = {
            tip: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    async handleSubmit(evt){
        evt.preventDefault()
        const user = {
            email: evt.target.email.value,
            password: evt.target.password.value
        }
        let email = user.email.split(' ').join('')
        let password = user.password.split(' ').join('')
        
        if(!email) {
            this.setState({ tip: 'Email can not be empty.'})
        } else if(!password) {
            this.setState({ tip: 'Password can not be empty.'})
        } else {
        let res = await this.props.userLogIn(user)
        console.log(res)
        this.props.history.push('/')
        }
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
            <caption>User LogIn</caption>
            <table className='form_table'>
                <tbody>
                    <tr>
                        <th>
                            <input type='email' name='email' placeholder='Email' />
                        </th>
                    </tr>
                    <tr>
                        <th>
                        <input type='password' name='password' placeholder='Password'/>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <font color='red'>{this.state.tip}</font>
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