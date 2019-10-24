import React, { Component } from 'react'
import HomeScreen from './Home'
import UserScreen from './User'

import { createStackNavigator, createAppContainer } from 'react-navigation'

const navigator = createStackNavigator({
  home: {screen: HomeScreen},
  user: {screen: UserScreen}
}, {
  initialRouteName: 'home',
  headerMode: 'none'
})

const App = createAppContainer(navigator)

export default App