import React from 'react';
import { ScrollView, View, Text, TextInput, Button, TouchableHighlight, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'


class RepoEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      location: '',
      user: '',
      password: '',
      branch: '',
      command: '',
      args: [],
      loading: false
    }
  }
  static navigationOptions = ({ navigation }) => ({
    drawerLabel: 'Repo Edit',
    headerTitle: 'Repo Edit'
  })
  async componentWillMount () {
    var response = await fetch(`http://ci.lolobyte.com/api/projects/repo/${this.props.repo}`)
    var result = await response.json()
    if (result.success) {
      const data = result.data
      this.setState({ location: data.location, user: data.user, args: data.args })
    }
  }
  _onAddPress = () => {
    const command = this.state.command
    const commands = Object.assign([], this.state.args)
    commands.push(command)
    this.setState({ args: commands, command: '' })
  }
  _onRemovePress = (index) => {
    const commands = Object.assign([], this.state.args)
    commands.splice(index, 1)
    this.setState({ args: commands })
  }
  _onSavePress = async (id, index) => {
    try {
      this.setState({ loading: true })
      var obj = {
        id: this.props.repo,
        location: this.state.location,
        user: this.state.user,
        branch: this.state.branch,
        args: this.state.args
      }
      if (this.state.password.length > 0) {
        obj.password = this.state.password
      }
      var response = await fetch(`http://ci.lolobyte.com/api/projects/repo`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
      })
      var result = await response.json()
    } catch (error) {
      
    }
    this.setState({ loading: false })
  }
  render () {
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white', margin: 10, padding: 20 }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}> {this.state.name} </Text>
        </View> 
        <View style={{flex: 3, flexDirection: 'column'}}>
          <TextInput placeholder="Location"
            onChangeText= {(location) => this.setState({location})}
            value= {this.state.location}
          />
          <TextInput placeholder="Git Username"
            onChangeText= {(user) => this.setState({user})}
            value= {this.state.user}
          />
          <TextInput placeholder="Password"
            onChangeText= {(password) => this.setState({password})}
            value= {this.state.password}
            secureTextEntry= {true}
          />
          <TextInput placeholder="Git Branch"
            onChangeText= {(branch) => this.setState({branch})}
            value= {this.state.branch}
          />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 4 }}>
              <TextInput placeholder="Command"
                onChangeText= {(command) => {
                  this.setState({command}) 
                }}
                value= {this.state.command}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', paddingVertical: 5 }}>
              <TouchableHighlight
                underlayColor='white'
                activeOpacity={0.5}            
                onPress={() => this._onAddPress() }
              >
              <Icon
                name='add'
                size={36}
                color='gray' />
              </TouchableHighlight>
            </View>
          </View>
          {
            this.state.args.map((c,i) => {
              return (
                <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }} key={i} >
                  <View style={{ flex: 4 }}>
                    <Text> {c} </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableHighlight
                      underlayColor='white'
                      activeOpacity={0.5}  
                      onPress={() => this._onRemovePress(i)}
                    >
                      <Icon
                        name='remove'
                        size={36}
                        color='gray' />
                    </TouchableHighlight>
                  </View>
                </View>
              )
            })
          }
          
          <View style={{paddingTop: 50}}>
            {
              this.state.loading ? 
              <ActivityIndicator />
              :
              <Button              
               onPress={() => this._onSavePress() } 
               title="Save"
             />
            }
          </View>
          
        </View>
      </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  repo: state.app.repo
})

export default connect(mapStateToProps)(RepoEdit)