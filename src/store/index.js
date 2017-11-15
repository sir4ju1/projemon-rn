import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import ReconnectingWS from 'reconnecting-websocket'

export default function configureStore(initialState) {
  const socket = function () {
    return new ReconnectingWS('ws://ci.lolobyte.com/socket')
  }
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk.withExtraArgument(socket)),
  )
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
