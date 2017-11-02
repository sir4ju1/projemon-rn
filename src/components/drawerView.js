import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
 } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

const style = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    paddingVertical: 50
  },
  buttonStyle: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    fontSize: 16
  }
})


export default ({ navigation }) => (
  <View>
    <View style={style.header}>
      <Icon name="user" size={60}/>
      <Text style={style.text}>Hello</Text>
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={style.buttonStyle}> 
      <Text style={style.text}> Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Projects')} style={style.buttonStyle}>  
      <Text style={style.text}> Projects</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={style.buttonStyle}>  
      <Text style={style.text}> Login</Text>
    </TouchableOpacity>
  </View>
)
