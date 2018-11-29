import React, { Component } from 'react'
import { connect } from 'react-redux'
import { thunkGetHoldings } from '../store/holdings'
import './components.css'
import axios from 'axios'



class Display extends Component {
    constructor(props){
        super(props)
        this.state = {
            hDetails: {},
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
        this.props.getHoldings()
        this.autoUpdateHoldings()
    }

   autoUpdateHoldings(){
        this.autoRun = setInterval(() => {
            // console.log('call update')
            const { holdings } = this.props
            this.updateH(holdings)
        }, 300);
    }

    componentWillUnmount(){
        clearInterval(this.autoRun)
    }

    async updateH(holdings){
        let hdPromis = holdings.map((holding) => {
            return axios.get(`https://api.iextrading.com/1.0/stock/${holding.symbol}/quote`)
        })
        let hdRes = await Promise.all(hdPromis)
        let hDetails = {}
        for(let i = 0; i < hdRes.length; i++){
            const { symbol, open, latestPrice } = hdRes[i].data
            hDetails[symbol.toLowerCase()] = { openPrice: open, currentPrice: latestPrice}
        }
        console.log('Holding details:')
        console.log(hDetails)
        this.setState({ hDetails })
    }

    handleChange(evt){
        this.setState({ [evt.target.name]: evt.target.value })
    }

    render(){
        const { holdings } = this.props
        const { hDetails } = this.state
        console.log(holdings)
        return(
            <table className='display_table'>
                <tbody>
                {holdings.map((holding) => {
                    const { id, symbol, shares } = holding
                    let fontColor = 'grey'
                    if(hDetails[symbol]){
                        if(hDetails[symbol].currentPrice > hDetails[symbol].openPrice){
                            fontColor = 'green'
                        } else if(hDetails[symbol].currentPrice < hDetails[symbol].openPrice){
                            fontColor = 'red'
                        }
                    }
                    return (
                        <tr key={id}>
                            <th>
                                <font color={fontColor}>
                                {`${symbol.toUpperCase()} -  ${shares} Shares`}
                                </font>
                            </th>
                            <th>
                                <font color={fontColor}>
                                {`$${shares*(hDetails[symbol] ? hDetails[symbol].currentPrice : 11)}`}
                                </font>
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
        getHoldings: () => dispatch(thunkGetHoldings()),
    }
}

export default connect(mapState, mapDispatch)(Display)