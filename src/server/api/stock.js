const stockRouter = require('express').Router()
const axios = require('axios')

const { epPrefix } = require('../utils/api-utils')
const { User, Holding, Transaction } = require('../db')


// user/stock get - get all current user's holding
stockRouter.get('/', async (req, res, next) => {
    const uid = req.session.userId
    Holding.findAll({ where: { userId: uid }})
            .then((holdings) => {
                res.send(holdings)
            })
            .catch(next)
})

// user/stock/transaction get - get all current user's transactions
stockRouter.get('/transaction', (req, res, next) => {
    const uid = req.session.userId
    Transaction.findAll({ where: { userId: uid }, order: [['createdAt', 'DESC']] })
                .then((transactions) => {
                    res.send(transactions)
                })
                .catch(next)
})

// user/stock/transaction post - create a buy/sell transaction 
stockRouter.post('/transaction', async (req, res, next) => {
    const uid = req.session.userId
    let { symbol, shares, activity } = req.body
    // shares can not be nagetive
    shares = Math.abs(shares)
    try{

        if ( activity === 'BUY' ){
            // buy - before update, check if there's enough money to buy
            let resPrice = axios.get(`${epPrefix}/stock/${symbol}/price`)
            let resUser = User.findOne({ where: { id: uid } })

            // let user = await User.findById(1)
            let [rPrice, rUser] = await Promise.all([resPrice, resUser])

            let currentPrice = rPrice.data
            let user = rUser

            let expense = currentPrice * 100 * shares
            if (expense > user.balance){
                res.status(403).send('Not enough balance for purchase')
            } else {
                let newTransaction = {
                    symbol,
                    activity,
                    price: currentPrice * 100,
                    shares,
                    userId: uid
                }
                // create purchase:
                // 1) search holding, add or create share in Holding
                // 2) deduct balance, update balance in User with new balance
                // 3) create new transaction in Transaction

                // Holding.findOne({ where: { userId: uid, symbol: symbol}})
                //         .then((holding) => {
                //             // console.log(holding)
                //             if(holding){
                //                 return holding.update({ shares: holding.shares + shares })
                //             } else {
                //                 return Holding.create({ symbol, shares, userId: uid})
                //             }
                //         })
                //         .catch(next)
                // user.update({ balance: user.balance - expense})
                //     .then(()=>{})
                //     .catch(next)
                // Transaction.create(newTransaction)
                //             .then((transaction) => {
                //                 res.send(user)
                //             })
                //             .catch(next)



                let resHolding = Holding.findOne({ where: { userId: uid, symbol: symbol}})
                // let resUser = user.update({ balance: user.balance - expense})
                let resUser = user.decrement('balance', { by: expense })
                let resTransaction = Transaction.create(newTransaction)
                let [ rHolding, rUser, rTransaction ] = await Promise.all([ resHolding, resUser, resTransaction ])
                console.log(rHolding)
                
                if(rHolding){
                    resHolding = await rHolding.update({ shares: rHolding.shares + shares })
                } else {
                    resHolding = await Holding.create({ symbol, shares, userId: uid })
                }

                res.send({ holding: resHolding, transaction: rTransaction })
            }
        } else if ( activity === 'SELL' ) {
            // sell - before update, check if there's enough shares to sell
            let resCurrentPrice = await axios.get(`${epPrefix}/stock/${symbol}/price`)
            let resHolding = await Holding.findOne({ where: { userId: uid, symbol: symbol }})

            let [ rCurrentPrice, rHolding ] = await Promise.all([ resCurrentPrice, resHolding ])
            let currentPrice = rCurrentPrice.data
            if (rHolding && rHolding.shares >= shares){
                let profit = currentPrice * 100 * shares
                let newTransaction = {
                    symbol,
                    activity,
                    price: currentPrice * 100,
                    shares,
                    userId: uid
                }
                // create purchase:
                // 1) search holding, add or create share in Holding
                // 2) deduct balance, update balance in User with new balance
                // 3) create new transaction in Transaction

                // console.log('Profit is: ', profit)
                if(rHolding.shares === shares){
                    resHolding = rHolding.destroy()
                } else {
                    resHolding = rHolding.update({ shares: rHolding.shares - shares })
                }
                let resUser = User.findOne({ where: { id: uid } })
                let resTransaction = Transaction.create(newTransaction)
                let [ rUser ] = await Promise.all([ resUser, resHolding, resTransaction ])
                rUser.increment('balance', { by: profit })
                        .then(() => { res.send('Success') })
                        .catch(next)

                // if(rHolding.shares === shares){
                //     resHolding = rHolding.destroy()
                // } else {
                //     rHolding.update({ shares: rHolding.shares - shares })
                //             .then(() => {})
                //             .catch(next)
                // }
                // User.findOne({ where: { id: uid } })
                //     .then((user) => {
                //         // console.log('User balance')
                //         // console.log(user.balance)
                //         return user.increment('balance', { by: profit })
                //     })
                //     .then(() => {})
                //     .catch(next)
                // Transaction.create(newTransaction)
                //             .then((transaction) => {
                //                 res.send('success')
                //             })
                //             .catch(next)
            } else {
                res.status(403).send('Do not have enough shares to sell')
            }
            // res.send('Connect success!')
        } else {
            res.status(400).send('Not recognized')
        }

    } catch(err) {
        // console.log('**********err.response**************')
        // console.log(err.response.status)
        // console.log('**********err.message***************')
        // console.log(err.response.data)
        // console.log('--------Inside promise all-----------')
        // console.log(err.response.statusText)
        // // console.error(err.response)
        res.status(err.response.status).send(err.response.statusText + ' : ' + err.response.data)
        // next(err)
    }
    

})

module.exports = stockRouter