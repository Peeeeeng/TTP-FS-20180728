const Sequelize = require('sequelize')
const db = require('./db')

const Transaction = db.define('transaction', {
    symbol: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    activity: {
        type: Sequelize.ENUM('BUY', 'SELL'),
        allowNull: false,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            notIn: [0]
        }
    },
    shares: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            notIn: [0]
        }
    }
})

module.exports = Transaction