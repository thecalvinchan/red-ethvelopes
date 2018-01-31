import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { Web3Provider } from 'react-web3';

import { applyMiddleware, createStore, combineReducers } from 'redux'; 

import createSagaMiddleware from 'redux-saga';
import { put, takeLatest } from 'redux-saga/effects';

import RedEthvelopeContract from '../build/contracts/RedEthvelope.json';
import contract from 'truffle-contract';

function* fetchRedEthvelope(action) {
  try {
    const RedEthvelope = contract(RedEthvelopeContract);
    const { web3 } = window;
    RedEthvelope.setProvider(web3.currentProvider);
    const instance = yield RedEthvelope.deployed();
    yield put({type: 'CONTRACT_DEPLOYED', instance});
  } catch(e) {
    yield put({type: 'CONTRACT_ERROR'});
  }
};

function* redEthvelopeSaga () {
  yield takeLatest('CONTRACT_FETCH', fetchRedEthvelope);
};

const sagaMiddleware = createSagaMiddleware();

/**
 *
 * store schema
 *
 * {
 *  redEthvelope
 * }
 *
 **/

const redEthvelope = (state = null, action) => {
  switch (action.type) {
    case 'CONTRACT_DEPLOYED':
      return action.instance;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  redEthvelope
});

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
store.subscribe(() => {
  console.log("STORE STATE CHANGED", store.getState());
});

sagaMiddleware.run(redEthvelopeSaga);

const WrappedApp = () => (
  <Provider store={store}>
    <Web3Provider>
      <App />
    </Web3Provider>
  </Provider>
)

ReactDOM.render(WrappedApp(), document.getElementById('root'));
registerServiceWorker();
