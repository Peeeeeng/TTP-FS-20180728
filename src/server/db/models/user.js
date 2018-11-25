const Sequelize = require('sequelize')
const db = require('./db')

const User = db.define('user', {
    userName: {
        type:  Sequelize.STRING,
        allowNull: false    
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    }
})

module.exports = User