import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import LogIn from './LogIn'
import Register from './Register'


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
    }

    render(){
        const { history } = this.props
        if(history.location.pathname != '/') history.push('/')
        return(
            <div>
                <header className="App-header">
                    <button type='button' name='login' onClick={this.handleChange}>Log In</button>
                    <button type='button' name='register'onClick={this.handleChange}>Register</button>
                </header>
                <main> 
                {this.state.login ? <LogIn /> : <Register />}
                </main>
            </div>
        )
    }
}


export default withRouter(SignIn)