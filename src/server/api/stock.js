const stockRouter = require('express').Router()
const axios = require('axios').Router()
const { User, Holding, Transaction } = require('../db')


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
    let { symbol, shares, activity } = req.body
    shares = Math.abs(shares)
    if ( activity === 'BUY' ){
        // buy - before update, check if there's enough money to buy
        let currentPrice = axios.get(`/stock/${symbol}/price`)
        let user = User.find({ where: { id: uid }})
        Promise.all([currentPrice, user])
                .then(([pPrice, pUser]) => {
                    currentPrice = pPrice
                    user = pUser
                })
                .catch(next)
        // shares can not be nagetive
        let expense = currentPrice * shares
        if (expense > user.balance){
            res.status(403).send('Not enough balance for purchase')
        } else {
            let newTransaction = {
                symbol,
                activity,
                price: currentPrice,
                shares,
                userId: uid
            }
            // create purchase:
            // 1) search holding, add or create share in Holding
            // 2) deduct balance, update balance in User with new balance
            // 3) create new transaction in Transaction
            Holding.find({ where: { userId: uid, symbol: symbol}})
                    .then((holding) => {
                        if(holding){
                            return holding.update({ shares: holding.shares + shares })
                        } else {
                            return holding.update({ symbol, shares})
                        }
                    })
                    .catch(next)
            user.update({ balance: user.balance - expense})
            Transaction.create(newTransaction)
                        .then((transaction) => {
                            res.send('success')
                        })
                        .catch(next)
        }
    } else if ( activity === 'SELL' ) {
        // sell - before update, check if there's enough shares to sell
        let currentPrice = axios.get(`/stock/${symbol}/price`)
        let holding = Holding.find({ where: { userId: uid, symbol: symbol }})
        Promise.all([currentPrice, holding])
                .then(([pPrice, pHolding]) => {
                    currentPrice = pPrice
                    holding = pHolding
                })
                .catch(next)
        if (holding && holding.shares >= shares){
            let profit = currentPrice * shares
            let newTransaction = {
                symbol,
                activity,
                price: currentPrice,
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
            User.find({ where: { id: uid } })
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
    }
    

})

module.exports = stockRouter