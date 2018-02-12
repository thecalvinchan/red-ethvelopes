import contract from 'truffle-contract';
import { put, takeLatest } from 'redux-saga/effects';

import RedEthvelopeContract from '../../build/contracts/RedEthvelope.json';

function* fetchRedEthvelopeContract(action) {
  try {
    const RedEthvelope = contract(RedEthvelopeContract);
    const { web3 } = window;
    RedEthvelope.setProvider(web3.currentProvider);
    const instance = yield RedEthvelope.deployed();
    yield put({type: 'EVENTS_WATCH', instance});
    yield put({type: 'CONTRACT_DEPLOYED', instance});
  } catch(e) {
    yield put({type: 'CONTRACT_ERROR'});
  }
};

export default function* redEthvelopeContractSaga() {
  yield takeLatest('CONTRACT_FETCH', fetchRedEthvelopeContract);
};
