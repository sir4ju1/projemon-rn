import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'

export default function configureStore(initialState) {
  const socket = function () {
    return new WebSocket("ws://ci.lolobyte.com/socket")
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
