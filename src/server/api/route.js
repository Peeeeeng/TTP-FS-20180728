const router = require('express').Router()
const axios = require('axios')

const epPrefix = require('../utils/api-utils')

module.exports = router

router.get('*', (req, res, next) => {
    res.send('OK')
})