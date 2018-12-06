import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import transactions from './transactions'
import holdings from './holdings'
import user from './user'
import notification from './notification'

const reducer = combineReducers({ transactions, holdings, user, notification })
const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
const store = createStore(reducer, middleware)

export default store