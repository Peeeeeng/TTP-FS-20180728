const userRouter = require('express').Router()
const axios = require('axios')
const { User } = require('../db')

const promoBalance = 500000

// user post - create account, new user gets $5000 to start with(promo code maybe)
userRouter.post('/', async (req, res, next) => {
    const { userName, email, password } = req.body
    if (userName && email && password){
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
    } else {
        res.status(403).send('Options can not be empty.')
    }

})

userRouter.put('/login', (req, res, next) => {
    const { email, password } = req.body
    if (email && password){
        User.findOne({ where: { email, password }})
        .then((user) => {
            if(user){
                req.session.userId = user.id
                console.log(user.dataValues)
                user.dataValues.password = null
                // pass back without password?

                res.json(user)
            } else {
                res.status(401).send('Email or Password incorrect')
            }
        })
        .catch(next)
    } else {
        res.status(403).send('Options can not be empty.')
    }
    
})

userRouter.get('/varify', (req, res, next) => {
    if(req.session.userId){
        User.findById(req.session.userId)
            .then((user) => {
                if(user){
                    // pass back without password?
                    user.dataValues.password = null
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
    if (userName){
        User.findOne({ where: { id: uid }})
        .then((user) => {
            return user.update(userName)
        })
        .then((user) => {
            res.send(user)
        })
        .catch(next)
    } else {
        res.status(403).send('Change option can not be empty.')
    } 
})

userRouter.use('/stock', require('./stock'))


module.exports = userRouter