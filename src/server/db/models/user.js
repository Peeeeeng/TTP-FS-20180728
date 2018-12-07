const Sequelize = require('sequelize')
const db = require('./db')
const DataTypes = require('sequelize').DataTypes

const User = db.define('user', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    userName: {
        type:  Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }    
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true,
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
            notEmpty: true,
        }
    }
})

module.exports = User