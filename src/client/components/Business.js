import React, { Component } from 'react'
import { connect } from 'react-redux'
import { thunkCreateTrans, thunkGetTrans } from '../store/transactions'
import { thunkGetHoldings } from '../store/holdings'


class Business extends Component {
    constructor(props){
        super(props)
        this.state = {
            symbol: '',
            shares: 0
        }
        this.handleTransaction = this.handleTransaction.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(evt){
        this.setState({ [evt.target.name]: evt.target.value })
    }

    handleTransaction(evt){
        evt.preventDefault()
        const { symbol, shares } = this.state
        const newTransaction = {
            symbol,
            shares,
            activity: evt.target.name
        }
        this.props.createTransaction(newTransaction)
                    .then(() => {
                        console.log('get holdings')
                        return this.props.getHoldings()
                    })
                    .then(() => {
                        console.log('get transactions')
                        this.props.getTransactions()
                    })
                    .catch((err) => {
                        console.error(err)
                    })
    }
    render(){
        return(
            
            <form onSubmit={this.handleTransaction}>
            <table id='business_table'>
            <caption id='business_table_caption'>{`Cash - $${this.props.user.balance/100}`}</caption>
            <tbody>
            <tr>
                <th>
                <label>Symbol</label>
                </th>
                <th>
                <input type='text' name='symbol' onChange={this.handleChange} />
                </th>
            </tr>
            <tr>
                <th>
                <label>Qty</label>
                </th>
                <th>
                <input type='text' name='shares' onChange={this.handleChange} />
                </th>
            </tr>
            </tbody>
            </table>
                <button type='button' onClick={this.handleTransaction} name='BUY'>BUY!</button>
                <button type='button' onClick={this.handleTransaction} name='SELL'>SELL</button>
            </form>
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
        createTransaction: (trans) => dispatch(thunkCreateTrans(trans)),
        getTransactions: () => dispatch(thunkGetTrans()),
        getHoldings: () => dispatch(thunkGetHoldings()),
    }
}

export default connect(mapState, mapDispatch)(Business)