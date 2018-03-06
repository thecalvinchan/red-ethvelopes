import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Web3Provider } from 'react-web3';

import { Web3Unavailable, AccountUnavailable } from './features/Web3Unavailable';
import CreateAndSendEthvelope from './features/CreateAndSendEthvelope';
import EthvelopeList from './features/EthvelopeList';

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
          </h3>
          <br/>
          <h3>
            Impress your friends and family this Chinese New Year by sending them "Lai See" ethvelopes.
          </h3>
        </header>
          <Web3Provider 
            web3UnavailableScreen={Web3Unavailable}
            accountUnavailableScreen={Web3Unavailable}
          >
            <CreateAndSendEthvelope />
            <EthvelopeList />
          </Web3Provider>
      </div>
    );
  }
}

export default App;
