import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './store/index'
import logo from '../logo.svg';
import './App.css';
import Display from './components/Display'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store} >
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          <Display />
        </Provider>
      </div>
    );
  }
}

export default App;
