/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux'

import MainNavigator from './navigators'
import createStore from './store'
const store = createStore()

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    )
  }
}
