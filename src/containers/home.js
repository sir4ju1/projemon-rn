import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Button, FlatList, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import DrawerButton from '../components/drawerButton'
import vsts from '../api/common'
import firebase from '../api/firebase'


class HomeScreen extends React.PureComponent {
  constructor (props) {
    super(props)
    var self = this
    this.itemRef = firebase.database().ref()
    this.state = {
      data: []
    }
    firebase.database().ref('projects/').once('value').then(function(snapshot) {
      var data = []
      snapshot.forEach(child => {
        data.push({
          id: child.key,
          name: child.val().name
        })
      })
      self.setState({
        data
      })
    })

  }
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Home',
    headerTitle: 'Home',
    headerLeft: <DrawerButton navigation={navigation} />,
  })
  async componentDidMount () {
    try {
      this.listenForItems(this.itemRef)
      const value = await AsyncStorage.getItem('@TFSExplorer:auth');
      if (value !== null){
        this.props.store(value)
        vsts.setToken(value)
        console.log(value);

      } else {

        this.props.navigation.navigate('Login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  listenForItems = (itemRef) => {
    console.log('here inside')
    var self = this

    firebase.database().ref('projects/').on('value', (snap) => {
      var items = []
      snap.forEach(item => {
        items.push({
          id: item.key,
          name: item.val().name
        })
      })
      console.log(items)
      self.setState({ data: items })
    })
  }
  render () {

    return (
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (<Text>{item.name}</Text>)}
        />
    )
  }
}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
})
const mapDispatchToProps = dispatch => ({
  store: (token) => dispatch({ type: 'Store', token }),
})


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
