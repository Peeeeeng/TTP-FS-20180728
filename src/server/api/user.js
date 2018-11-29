const userRouter = require('express').Router()
const axios = require('axios')
const { User } = require('../db')

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

userRouter.put('/login', (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ where: { email, password }})
        .then((user) => {
            if(user){
                req.session.userId = user.id
                
                // pass back without password?
                res.json(user)
            } else {
                res.status(401).send('Email or Password incorrect')
            }
        })
        .catch(next)
})

userRouter.get('/varify', (req, res, next) => {
    if(req.session.userId){
        User.findById(req.session.userId)
            .then((user) => {
                if(user){
                    // pass back without password?
                    res.json(user)
                } else {
                    res.status(404).send('Not exist')
                }
            })
    } else {
        res.status(404).send('Not exist')
    }
})

// user/:UId put - update userName /password-maybe, email cannot be changed
userRouter.put('/', async (req, res, next) => {
    const uid = req.session.userId
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