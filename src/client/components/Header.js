import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import logo from '../../logo.svg'


class Header extends Component {
    render(){
        return(
            <header className="App-header">
                <Link to='/portfolio'>Portfolio</Link>
                <Link to='/transactions'>Transactions</Link>
            </header>
        )
    }
}

export default Header

