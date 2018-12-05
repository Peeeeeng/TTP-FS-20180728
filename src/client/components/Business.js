import React, { Component } from 'react'
import { connect } from 'react-redux'
import { thunkCreateTrans, thunkGetTrans } from '../store/transactions'
import { thunkGetHoldings } from '../store/holdings'
import { thunkVarifyUser } from '../store/user'


class Business extends Component {
    constructor(props){
        super(props)
        this.state = {
            symbol: '',
            shares: 0,
            tip: ''
        }
        this.handleTransaction = this.handleTransaction.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(evt){
        this.setState({ [evt.target.name]: evt.target.value, tip: '' })
    }

    handleTransaction(evt){
        evt.preventDefault()
        const { symbol, shares } = this.state
        if(symbol.split(' ').join('')){
            if(shares > 0 && Number.isInteger(Number(shares))){
                const newTransaction = {
                    symbol,
                    shares,
                    activity: evt.target.name
                }
                this.props.createTransaction(newTransaction)
                            .then((res) => {
                                console.log('Transaction created successfully')
                                return this.props.getHoldings()
                            })
                            .then(() => {
                                return this.props.getTransactions()
                            })
                            .then(() => {
                                this.props.getUser()
                            })
                            .catch((err) => {
                                console.log('Transaction error!')
                                console.error(err)
                            })
            } else {
                if(isNaN(shares)){
                    this.setState({ shares: 0, tip: 'Qty needs to be a number.' })
                } else if(shares < 1) {
                    this.setState({ shares: 0, tip: 'Qty needs to be bigger than 0.' })
                } else if(!Number.isInteger(Number(shares))) {
                    this.setState({ shares: 0, tip: 'Qty needs to be a whole number.' })
                }
            }
        } else {
            this.setState({ symbol: '', tip: 'Symbol can not be empty.' })
        }
    }

    render(){
        const { symbol, shares, tip } = this.state
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
                <input type='text' name='symbol' onChange={this.handleChange} value={symbol} />
                </th>
            </tr>
            <tr>
                <th>
                <label>Qty</label>
                </th>
                <th>
                <input type='text' name='shares' onChange={this.handleChange} value={shares} />
                </th>
            </tr>
            <tr>
                <th colSpan='2' >
                <font color='red'>{tip}</font>
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
        getUser: () => dispatch(thunkVarifyUser()),
    }
}

export default connect(mapState, mapDispatch)(Business)