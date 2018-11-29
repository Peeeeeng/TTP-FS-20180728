import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Display from './Display'
import Business from './Business'


class Portfolio extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentListener: []
        }
    }

    componentDidMount(){

    }

    componentWillUnmount(){
        // unsubscribe listeners
        // stop auto run
    }

    render(){
        return(
            <div id='portfolio_Main'>

                <div>
                    <Display />
                </div>
                <div id='portfolio_business'>
                    <Business />
                </div>
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        user: state.user,
        holdings: state.holdings,
        transactions: state.transactions
    }
}

const mapDispatch = (dispatch) => {
    return {

    }
}

export default withRouter(connect(mapState, mapDispatch)(Portfolio))