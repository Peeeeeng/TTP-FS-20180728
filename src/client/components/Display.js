import socket from 'socket.io-client'
import React, { Component } from 'react'

const io = socket('https://ws-api.iextrading.com/1.0/tops')

let receivedText = ''

export default class Display extends Component {
    constructor(props){
        super(props)
        this.state = {
            receivedText: ''
        }
        this.updateText = this.updateText.bind(this)
    }
    updateText(){
        setInterval(() => {
            console.log('call update')
            this.setState({
            receivedText: ''
            })
        }, 300);
        
    }
    componentDidMount(){
        this.updateText()
    }

    componentDidUpdate(){
        // this.updateText()
    }
    render(){
        return(
            <div>
                <h4>
                    {receivedText}
                </h4>
            </div>
        )
    }
}

// Listen to the channel's messages
io.on('message', message => {
    receivedText = message
    // console.log(message)
})

// Connect to the channel
io.on('connect', () => {

  // Subscribe to topics (i.e. appl,fb,aig+)
  io.emit('subscribe', 'snap,fb,aig+')

  // Unsubscribe from topics (i.e. aig+)
//   io.emit('unsubscribe', 'aig+')
})

// Disconnect from the channel
io.on('disconnect', () => console.log('Disconnected.'))