import socket from 'socket.io-client'
import React, { Component } from 'react'
import axios from 'axios'
// const backendHost = 'http://localhost:8080'

const io = socket('https://ws-api.iextrading.com/1.0/tops')

// let receivedText = ''

export default class Display extends Component {
    constructor(props){
        super(props)
        this.state = {
            receivedText: '',
            userName: '',
            email: '',
            password: '',
            symbol: '',
            shares: 0,
        }
        this.updateText = this.updateText.bind(this)
        this.listener = this.listener.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePurchase = this.handlePurchase.bind(this)
        this.handleSell = this.handleSell.bind(this)
        this.handleGetHolding = this.handleGetHolding.bind(this)
        this.handleGetTransaction = this.handleGetTransaction.bind(this)
    }
    updateText(){
        setInterval(() => {
            console.log('call update')
            this.setState({
            receivedText: ''
            })
        }, 300);
    }

    listener(){
        // Listen to the channel's messages
        io.on('message', message => {
            this.setState({ receivedText: message })
            
            // console.log(message)
        })

        // Connect to the channel
        io.on('connect', () => {

        // Subscribe to topics (i.e. appl,fb,aig+)
        io.emit('subscribe', 'snap,fb,aapl,aig+')

        // Unsubscribe from topics (i.e. aig+)
        //   io.emit('unsubscribe', 'aig+')
        })

        // Disconnect from the channel
        io.on('disconnect', () => console.log('Disconnected.'))
    }
    componentDidMount(){
        // this.updateText()
        this.listener()
    }

    componentDidUpdate(){
        // this.updateText()
    }
    async handleSubmit(evt){
        evt.preventDefault()
        console.log('Form submitted!')
        const { userName, email, password } = this.state
        const newUser = {
            userName,
            email,
            password
        }
        const user = await axios.post(`/api/user`, newUser)
        console.log(user)
    }

    handleChange(evt){
        this.setState({ [evt.target.name]: evt.target.value })
    }

    async handleGetHolding(evt){
        const holdings = await axios.get(`/api/user/stock/1`)
        console.log(holdings)
    }

    async handleGetTransaction(evt){
        const transactions = await axios.get(`/api/user/stock/transaction/1`)
        console.log(transactions)
    }

    async handlePurchase(evt){
        evt.preventDefault()
        const { symbol, shares } = this.state
        const newTransaction = {
            symbol,
            shares,
            activity: 'BUY'
        }
        const transactions = await axios.post(`/api/user/stock/transaction/1`, newTransaction)
        console.log(transactions)
    }

    async handleSell(evt){
        const { symbol, shares } = this.state
        const newTransaction = {
            symbol,
            shares,
            activity: 'SELL'
        }
        const transactions = await axios.post(`/api/user/stock/transaction/1`, newTransaction)
        console.log(transactions)
    }

    render(){
        const { userName, email, password } = this.state
        const { symbol, shares } = this.state
        return(
            <div>
                <h4>
                    {this.state.receivedText}
                </h4>
                <form onSubmit={this.handleSubmit}>
                    <label>Register User</label>
                    <div>
                        <label>Name</label>
                        <input type='text' name='userName' value={userName} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type='text' name='email' value={email} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type='text' name='password' value={password} onChange={this.handleChange} />
                    </div>
                    <button type='submit'>Register!</button>
                    <button type='button'>Cancel</button>
                </form>
                <hr></hr>
                <form onSubmit={this.handlePurchase}>
                    <label>Stork Transactions</label>
                    <div>
                        <label>Symbol</label>
                        <input type='text' name='symbol' value={symbol} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Qty</label>
                        <input type='text' name='shares' value={shares} onChange={this.handleChange} />
                    </div>
                    <button type='button' onClick={this.handlePurchase}>BUY!</button>
                    <button type='button' onClick={this.handleSell}>SELL</button>
                    <button type='button' onClick={this.handleGetHolding}>Get Holding</button>
                    <button type='button' onClick={this.handleGetTransaction}>Get Transactions</button>
                </form>
            </div>
        )
    }
}

// // Listen to the channel's messages
// io.on('message', message => {
//     receivedText = message
//     // console.log(message)
// })

// // Connect to the channel
// io.on('connect', () => {

//   // Subscribe to topics (i.e. appl,fb,aig+)
//   io.emit('subscribe', 'snap,fb,aig+')

//   // Unsubscribe from topics (i.e. aig+)
// //   io.emit('unsubscribe', 'aig+')
// })

// // Disconnect from the channel
// io.on('disconnect', () => console.log('Disconnected.'))