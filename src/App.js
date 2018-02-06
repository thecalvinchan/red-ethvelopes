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
          <h1 className="App-title">恭喜發財!</h1>
          <h2 className="App-subtitle">
            Celebrate the New Year with Red ETHvelopes!
          </h2>
          <br/>
          <h3>
            Red Envelopes are a customary tradition during Chinese New Year. 
            <br/>
            Lai See, or Hong Bao, filled with treats and money, are given to others to celebrate the New Year.
            <br/>
          </h3>
          <h3>
            Red ETHvelopes are new type of "Lai See", a cryptocollectible built on top of the Ethereum blockchain.
          </h3>
          <h3>
            Impress your friends and family this New Year by sending them "Lai See" via Red ETHvelopes.
            <br/>
          </h3>
        </header>
        <CreateAndSendEthvelope />
        <EthvelopeList />
      </div>
    );
  }
}

export default App;
