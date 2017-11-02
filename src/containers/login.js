import React from 'react';
import { View, Text, TextInput, Button, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import base from '../api/base64'

class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: '',
      password: ''
    }
  }
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Login',
    headerTitle: 'Login',
  })
  _login = async () => {
    
    try {
      const token = base.btoa(`${this.state.user}:${this.state.password}`)
      await AsyncStorage.setItem('@TFSExplorer:auth', token)
      this.props.login(token)
      this.props.navigation.navigate('Home')
     
    } catch (error) {
      console.log(error)
    }
    
  }
  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white', margin: 10, padding: 20 }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}> Login </Text>
        </View> 
        <View style={{flex: 3, flexDirection: 'column'}}>
          <TextInput placeholder="Email"
            onChangeText= {(user) => this.setState({user})}
            value= {this.state.user}
          />
          <TextInput placeholder="Password"
            onChangeText= {(password) => this.setState({password})}
            value= {this.state.password}
            secureTextEntry= {true}
          />
          <View style={{paddingTop: 50}}>
            <Button
             
              onPress={() => this._login() }

              title="Login"

            />
          </View>
          
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.app.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
  login: (token) => dispatch({ type: 'Store', token }),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)