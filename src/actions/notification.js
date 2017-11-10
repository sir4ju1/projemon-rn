export function subscribeStatus() {
  return (dispatch, getState, socket) => {
    const ws = socket()
    ws.onopen = e => {
      ws.send('message from mobile')
    }
    ws.onmessage = event => {
      dispatch({ type: 'WS', wsData: event.data });
    }
  }
}