import { put, takeLatest } from 'redux-saga/effects';

function* fetchEthvelopes(action) {
  try {
    const { contract, account } = action;
    const ethvelopes = yield contract.tokensOf.call(account);
    yield put({type: 'FETCH_ETHVELOPES_SUCCESS', account, ethvelopes});
  } catch(error) {
    yield put({
      type: 'FETCH_ETHVELOPES_ERROR',
      error
    });
  }
};

export default function* ethvelopeSaga() {
  yield takeLatest('FETCH_ETHVELOPES', fetchEthvelopes);
};
