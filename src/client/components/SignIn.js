import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import LogIn from './LogIn'
import Register from './Register'
import { connect } from 'react-redux'
import { clearNote } from '../store/notification'


class SignIn extends Component {
    constructor(props){
        super(props)
        this.state = {
            login: true,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(evt){
        if(evt.target.name === 'login'){
            this.setState({ login: true })
        } else {
            this.setState({ login: false })
        }
        if(this.props.tip){
            this.props.clearNote()
        }
    }

    render(){
        const { history } = this.props
        if(history.location.pathname != '/') history.push('/')
        return(
            <div>
                <header className="App-header">
                    {this.state.login 
                        ? 
                        null 
                        : 
                        <button type='button' 
                                name='login' 
                                className='signInButton' 
                                onClick={this.handleChange}>Log In</button>}
                    {this.state.login 
                        ? 
                        <button type='button' 
                                name='register' 
                                className='signInButton' 
                                onClick={this.handleChange}>Register</button> 
                                : 
                                null}
                </header>
                <main> 
                {this.state.login ? <LogIn /> : <Register />}
                </main>
            </div>
        )
    }
}

const mapState = state => {
    return {
        tip: state.notification.tip,
    }
}

const mapDispatch = dispatch => {
    return {
        clearNote: () => dispatch(clearNote())
    }
}

export default withRouter(connect(mapState, mapDispatch)(SignIn))