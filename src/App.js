/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import appReducer from './reducers'
import MainNavigator from './navigators'

export default class App extends Component {
  store = createStore(appReducer)
  render () {
    return (
      <Provider store={this.store}>
        <MainNavigator />
      </Provider>
    )
  }
}
