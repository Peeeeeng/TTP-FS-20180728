const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')

const db = require('./db')

const PORT = process.env.PORT || 8080
const app = express()

module.exports = app

app.use(morgan('dev'))
app.use(express.json)
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', require('./api/route'))

app.use((req, res, next) => {
    if(path.extname(req.path).length){
        const err = new Error('Page not found...')
        err.status = 404
        next(err)
    } else {
        next()
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    console.log(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error!')
})

const startListening = () => {
    app.listen(PORT, () => {
        console.log('Server starts listening on prot: ', PORT)
    })
}


const syncDb = () => db.sync()


startListening()
syncDb()