const router = require('express').Router()

const epPrefix = require('../utils/api-utils')

module.exports = router

router.use('/user', require('./user'))