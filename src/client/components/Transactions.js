import React, { Component } from 'react'
import { connect } from 'react-redux'
import { thunkGetTrans } from '../store/transactions'
import './components.css'

class Transactions extends Component {
    componentDidMount(){
        this.props.getTransactions()
    }
    render(){
        const { transactions } = this.props.transactions
        console.log(transactions)
        return(
            <table className='display_table'>
                <tbody>
                    {!transactions.length ? <tr><th><font color='green'>You do not have any transaction record, yet.</font></th></tr> : null}
                {transactions.map((transaction) => {
                    return (
                        <tr key={transaction.id}>
                            <th>
                                {`${transaction.activity} (${transaction.symbol.toUpperCase()}) -  ${transaction.shares} Shares @ ${transaction.price/100}`}
                            </th>
                        </tr>
                    )
                })}
                </tbody>
            </table>
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
        getTransactions: () => dispatch(thunkGetTrans()),
    }
}

export default connect(mapState, mapDispatch)(Transactions)