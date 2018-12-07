const db = require('./models/db')
const User = require('./models/user')
const Transaction = require('./models/transaction')
const Holding = require('./models/holding')

Transaction.belongsTo(User, { foreignKey: { allowNull: false } })
User.hasMany(Transaction)

Holding.belongsTo(User, { foreignKey: { allowNull: false } })
User.hasMany(Holding)

module.exports = {
    db,
    User,
    Transaction,
    Holding
}