import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { thunkLogin } from '../store/user'
import { setNote, clearNote } from '../store/notification'

class LogIn extends Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    async handleSubmit(evt){
        evt.preventDefault()
        const user = {
            email: evt.target.email.value,
            password: evt.target.password.value
        }
        const { setNote, clearNote } = this.props
        let email = user.email.split(' ').join('')
        let password = user.password.split(' ').join('')
        
        if(!email) {
            setNote('Email can not be empty.')
        } else if(!password) {
            setNote('Password can not be empty.')
        } else {
        let res = await this.props.userLogIn(user)
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
            <caption>User LogIn</caption>
            <table className='form_table'>
                <tbody>
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
                <button type='submit'>Log In</button>
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
        userLogIn: (user) => dispatch(thunkLogin(user)),
        setNote: (tip) => dispatch(setNote(tip)),
        clearNote: () => dispatch(clearNote())
    }
}

export default withRouter(connect(mapState, mapDispatch)(LogIn))