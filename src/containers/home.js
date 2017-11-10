import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Button, FlatList, AsyncStorage, Alert } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import DrawerButton from '../components/drawerButton'
import ProjectCard from '../components/projectcard'
import * as notification from '../actions/notification'
import { bindActionCreators } from 'redux';
class HomeScreen extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      data: []
    }
  }
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Home',
    headerTitle: 'Home',
    headerLeft: <DrawerButton navigation={navigation} />,
  })
  async componentDidMount () {
    try {
      const projectIds = await AsyncStorage.getItem('project-stat')
      if (projectIds) {
        const ids = JSON.parse(projectIds)
        let items = []
        for (var index = 0; index < ids.length; index++) {
          const element = ids[index]
          const item = await AsyncStorage.getItem(`p:${element}`)
          items.push(JSON.parse(item))
        }
        this.setState({ data: items })
      } else {
        await this._fetchData()
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }
  componentWillReceiveProps  (next) {
    console.log(next.message)
    Alert.alert(
      'Alert Title',
      next.message,
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }
  _fetchData = async () => {
    this.setState({ refreshing: true })
    const response = await fetch('http://ci.lolobyte.com/api/projects/statistic')
    const result = await response.json()
    if (result.success) {
      let ids = []
      for (var index = 0; index < result.data.length; index++) {
        const element = result.data[index]
        ids.push(element._id)
        await AsyncStorage.setItem(`p:${element._id}`, JSON.stringify(element))
      }
      await AsyncStorage.setItem('project-stat', JSON.stringify(ids))
      this.setState({ data: result.data, refreshing: false })
      this.props.subscribeStatus()
    }
  }
  _onClosedStoriesPressed = (tfsId) => {
    this.props.setWorkIds(tfsId)
    this.props.navigation.navigate('WorkItemState', { refresh: this._fetchData })
  }
  _onMemberWitPressed = (tfsId, member) => {
    this.props.setMemberWorkIds(tfsId,`${member.displayName} <${member.uniqueName}>`)
    this.props.navigation.navigate('WorkItemMember', { refresh: this._fetchData })
  }
  _onIterationWitPressed = (tfsId, iteration) => {
    this.props.setIterationWorkIds(tfsId, iteration)
    this.props.navigation.navigate('WorkItemIteration')
  }
  render () {
    return (
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (<ProjectCard
            item={item} 
            onClosedStoriesPressed={(tfsId) => this._onClosedStoriesPressed(tfsId)}
            onMemberWitPressed={(tfsId, member) => this._onMemberWitPressed(tfsId, member)}
            onIterationWitPressed={(tfsId, iteration) => this._onIterationWitPressed(tfsId, iteration)}
          />)}
          onRefresh={async () => await this._fetchData()}
          refreshing={this.state.refreshing}
        />
    )
  }
}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  message: state.app.wsData
})
const mapDispatchToProps = dispatch => ({
  store: (token) => dispatch({ type: 'Store', token }),
  setWorkIds: (project) => dispatch({ type: 'WorkItems', project }),
  setMemberWorkIds: (project, member) => dispatch({ type: 'WorkItems', project, member }),
  setIterationWorkIds: (project, iteration) => dispatch({ type: 'WorkItems', project, iteration }),
  ...bindActionCreators(notification, dispatch)
})


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
