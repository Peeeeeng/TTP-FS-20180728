const stockRouter = require('express').Router()
const axios = require('axios')

const { epPrefix } = require('../utils/api-utils')
const { Holding, Transaction } = require('../db')
const User = require('../db/models/user')


// user/stock get - get all current user's holding
stockRouter.get('/:uid', (req, res, next) => {
    // check uid match session uid or get uid from session
    const { uid } = req.params
    Holding.findAll({ where: { id: uid }})
            .then((holdings) => {
                res.send(holdings)
            })
            .catch(next)
})

// user/stock/transaction get - get all current user's transactions
stockRouter.get('/transaction/:uid', (req, res, next) => {
    // check uid match session uid or get uid from session
    const { uid } = req.params
    Transaction.findAll({ where: { userId: uid }})
                .then((transactions) => {
                    res.send(transactions)
                })
                .catch(next)
})
// user/stock/transaction post - create a buy/sell transaction 
stockRouter.post('/transaction/:uid', async (req, res, next) => {
    // check uid match session uid or get uid from session
    const { uid } = req.params
    console.log('User ID is:', uid)
    let { symbol, shares, activity } = req.body
    shares = Math.abs(shares)
    if ( activity === 'BUY' ){
        // buy - before update, check if there's enough money to buy
        let currentPrice = await axios.get(`${epPrefix}/stock/${symbol}/price`)
        let user = await User.findOne({ where: { id: uid }})

        // let user = await User.findById(1)
        console.log('current price is: ', currentPrice.data)
        console.log('current user is: ', user.dataValues)
        // Promise.all([currentPrice, user])
        //         .then(function([res]){
        //             console.log('**********Inside promiseAll')
        //             console.log(res)
        //             // console.log(pUser)
        //             // currentPrice = pPrice * 100
        //             // user = pUser
        //         })
        //         .catch(function(err){
        //             console.error(err)
        //         })
        // console.log('Current Price is: ', currentPrice)
        // shares can not be nagetive
        let expense = currentPrice.data * 100 * shares
        if (expense > user.balance){
            res.status(403).send('Not enough balance for purchase')
        } else {
            let newTransaction = {
                symbol,
                activity,
                price: currentPrice.data,
                shares,
                userId: uid
            }
            // create purchase:
            // 1) search holding, add or create share in Holding
            // 2) deduct balance, update balance in User with new balance
            // 3) create new transaction in Transaction
            Holding.findOne({ where: { userId: uid, symbol: symbol}})
                    .then((holding) => {
                        // console.log(holding)
                        if(holding){
                            return holding.update({ shares: holding.shares + shares })
                        } else {
                            return Holding.create({ symbol, shares, userId: uid})
                        }
                    })
                    .catch(next)
            user.update({ balance: user.balance - expense})
                .then(()=>{})
                .catch(next)
            Transaction.create(newTransaction)
                        .then((transaction) => {
                            res.send('success')
                        })
                        .catch(next)
            // res.send('success')
        }
    } else if ( activity === 'SELL' ) {
        // sell - before update, check if there's enough shares to sell
        let currentPrice = await axios.get(`${epPrefix}/stock/${symbol}/price`)
        let holding = await Holding.findOne({ where: { userId: uid, symbol: symbol }})
        // Promise.all([currentPrice, holding])
        //         .then(([pPrice, pHolding]) => {
        //             currentPrice = pPrice * 100
        //             holding = pHolding
        //         })
        //         .catch(next)
        if (holding && holding.shares >= shares){
            let profit = currentPrice.data * shares
            let newTransaction = {
                symbol,
                activity,
                price: currentPrice.data,
                shares,
                userId: uid
            }
            // create purchase:
            // 1) search holding, add or create share in Holding
            // 2) deduct balance, update balance in User with new balance
            // 3) create new transaction in Transaction
            holding.update({ shares: holding.shares - shares })
                    .then(() => {})
                    .catch(next)
            User.findOne({ where: { id: uid } })
                .then((user) => {
                    return user.update({ balance: user.balance + profit})
                })
                .then(() => {})
                .catch(next)
            Transaction.create(newTransaction)
                        .then((transaction) => {
                            res.send('success')
                        })
                        .catch(next)
        } else {
            res.status(403).send('Do not have enough shares to sell')
        }
        // res.send('Connect success!')
    }
    

})

module.exports = stockRouter