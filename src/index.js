import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './client/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import store from './client/store/index'
const history = createHistory()

ReactDOM.render(
    <Provider store={store} >
        <Router history={history}>
            <App />
        </Router>
    </Provider>
, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
