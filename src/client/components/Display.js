import socket from 'socket.io-client'
import React, { Component } from 'react'

const io = socket('https://ws-api.iextrading.com/1.0/tops')

// let receivedText = ''

export default class Display extends Component {
    constructor(props){
        super(props)
        this.state = {
            receivedText: ''
        }
        this.updateText = this.updateText.bind(this)
        this.listener = this.listener.bind(this)
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
    render(){
        return(
            <div>
                <h4>
                    {this.state.receivedText}
                </h4>
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