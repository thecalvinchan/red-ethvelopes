import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import CreateAndSendEthvelope from './features/CreateAndSendEthvelope'
import EthvelopeList from './features/EthvelopeList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Red Ethvelopes</h1>
        </header>
        <CreateAndSendEthvelope />
        <EthvelopeList />
      </div>
    );
  }
}

export default App;
