import { put, takeEvery } from 'redux-saga/effects';

function* fetchEthvelope(action) {
  console.log(action);
  const { contract, id } = action;
  try {
    const balance = yield contract.tokenIdToWei.call(id);
    const metadataUrl = yield contract.tokenMetadata.call(id);
    yield put({
      type: 'FETCH_ETHVELOPE_SUCCESS',
      id,
      balance,
      metadataUrl
    });
  } catch (error) {
    yield put({
      type: 'FETCH_ETHVELOPE_ERROR',
      error
    });
  }
}

export default function* ethvelopeSaga() {
  yield takeEvery('FETCH_ETHVELOPE', fetchEthvelope);
};
