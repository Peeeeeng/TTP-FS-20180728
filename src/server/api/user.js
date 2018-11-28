const userRouter = require('express').Router()
const axios = require('axios')
const { User } = require('../db')


const eUser = 'Jhon Snow'
const promoBalance = 500000

// user post - create account, new user gets $5000 to start with(promo code maybe)
userRouter.post('/', async (req, res, next) => {
    const { userName, email, password } = req.body
    const newUser = {
        userName,
        email: email.toLowerCase(),
        password,
        balance: promoBalance
    }
    User.create(newUser)
        .then((user) => {
            res.send(user)
        })
        .catch(next)
})

// user/:UId put - update userName /password-maybe, email cannot be changed
userRouter.put('/:uid', async (req, res, next) => {
    const { uid } = req.params
    const { userName } = req.body
    // if current user match uid / or just get uid from session
    User.findOne({ where: { id: uid }})
        .then((user) => {
            return user.update(userName)
        })
        .then((user) => {
            res.send(user)
        })
        .catch(next)
})

// user get - get userName by email, varify if account exist already

// user/validation get - validate if the email & password matchs



userRouter.use('/stock', require('./stock'))
// user/stock/transaction get - get current user's all transactions

// user/stock/transaction post - create a buy/sell transaction 
// buy - before update, check if there's enough money to buy
// sell - before update, check if there's enough shares to sell



module.exports = userRouter