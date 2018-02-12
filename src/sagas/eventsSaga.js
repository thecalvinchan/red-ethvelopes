import { call, put, take } from 'redux-saga/effects';

function* startWatchingEvents(action) {
  try {
    const { instance } = action;
    console.log("Begin listening to contract events");
    console.log(instance);
    const ethvelopeCreatedAndSentEvent = instance.EthvelopeCreatedAndSent({}, {fromBlock: 0, toBlock: 'latest'});
    console.log(ethvelopeCreatedAndSentEvent);
    const events = ethvelopeCreatedAndSentEvent.watch((err, res) => {
      console.log(res);
    });
    console.log(events.get((err, res) => {
      console.log(res);
    }));
  } catch(e) {
    console.log(e);
    yield put({type: 'EVENTS_WATCH_ERROR'});
  }
}

export default function* eventsSaga() {
  const action = yield take('EVENTS_WATCH');
  yield call(startWatchingEvents, action);
};
