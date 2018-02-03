import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { Web3Provider } from 'react-web3';

import { applyMiddleware, createStore, combineReducers } from 'redux'; 

import createSagaMiddleware from 'redux-saga';

import contractSaga from './sagas/contractSaga';
import ethvelopesSaga from './sagas/ethvelopesSaga';
import ethvelopeSaga from './sagas/ethvelopeSaga';

const sagaMiddleware = createSagaMiddleware();

/**
 *
 * store schema
 *
 * {
 *  redEthvelopeContract: instanceOf RedEthvelopeContract
 *  ethvelopes: {
 *    address account => [ethvelopes]
 *  }
 * }
 *
 **/

const redEthvelopeContract = (state = null, action) => {
  switch (action.type) {
    case 'CONTRACT_DEPLOYED':
      return action.instance;
    default:
      return state;
  }
}

const accountEthvelopes = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_ETHVELOPES_SUCCESS':
      return {
        ...state,
        [action.account]: action.ethvelopes
      }
    default:
      return state;
  }
}

const selectedAccount = (state = null, action) => {
  switch (action.type) {
    case 'web3/RECEIVE_ACCOUNT':
    case 'web3/CHANGE_ACCOUNT':
      return action.address;
    default:
      return state;
  }
}

const ethvelopes = (state = {}, action) => {
  console.log(action);
  switch (action.type) {
    case 'FETCH_ETHVELOPE_SUCCESS':
      return {
        ...state,
        [action.id] : {
          balance: action.balance,
          metadataUrl: action.metadataUrl
        }
      };
    default:
      return state;
  }
}

const appReducer = combineReducers({
  redEthvelopeContract,
  accountEthvelopes,
  selectedAccount,
  ethvelopes
});

const rootReducer = (state, action) => {
  if (action.type === 'CHANGE_NETWORK') {
    appReducer({
      redEthvelopeContract: null,
      accountEthvelopes: {},
      ethvelopes: {},
      selectedAccount: null
    }, {});
  }
  return appReducer(state, action);
}

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
store.subscribe(() => {
  console.log("STORE STATE CHANGED", store.getState());
});

sagaMiddleware.run(contractSaga, store);
sagaMiddleware.run(ethvelopesSaga, store);
sagaMiddleware.run(ethvelopeSaga);

const WrappedApp = () => (
  <Provider store={store}>
    <Web3Provider>
      <App />
    </Web3Provider>
  </Provider>
)

ReactDOM.render(WrappedApp(), document.getElementById('root'));
registerServiceWorker();
