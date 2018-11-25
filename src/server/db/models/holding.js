const Sequelize = require('sequelize')
const db = require('./db')

const Holding = db.define('holding', {
    symbol: {
        type: Sequelize.STRING,
        allowNull: false,
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