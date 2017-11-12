import React from 'react';
import { View, Text, FlatList, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import DrawerButton from '../components/drawerButton'
import ProjectItem from '../components/projectItem'
import _ from 'lodash'

class ProjectScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      currentlyOpenSwipeable: null,
      data: []
    }
  }
  static navigationOptions = ({ navigation }) => ({
    drawerLabel: 'Projects',
    headerTitle: 'Projects',
    headerLeft: <DrawerButton navigation={navigation} />
  })
  
  async componentDidMount() {
    await this._fetchData()
  }
  _fetchData = async () => {
    this.setState({loading: true})
    var response = await fetch('http://ci.lolobyte.com/api/projects')
    var result = await response.json()
    if (result.success) {
      this.setState({ data: result.data })
      await AsyncStorage.setItem(`project-list`, JSON.stringify(result.data))
    }
    this.setState({ loading: false })
  }
  _handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  }

  _onPressItem = (project, workIds) => {
    this.props.setWorkIds(project)
    this.state.currentlyOpenSwipeable.recenter()
    this.props.navigation.navigate('ProjectEdit')
  }
  _onPullLeft = async (project, index) => {
    console.log('active')
    await this._stateChange(project, index, 'active')
  }
  _onCloseProject = async (project, index) => {
    console.log('closed')
    await this._stateChange(project, index, 'closed')
  }
  _stateChange = async (project, index, state) => {
    try {
      var response = await fetch(`http://ci.lolobyte.com/api/projects/${project}/state/${state}`,
      { method: 'patch', headers: { 'Content-Type': 'application/json' } })
      var result = await response.json()
      if (result.success) {
        const items = _.cloneDeep(this.state.data)
        items[index].status = state
        this.setState({ data: items })
        await AsyncStorage.setItem(`project-list`, JSON.stringify(items))
        this.state.currentlyOpenSwipeable.recenter()
      }
    } catch (error) {
      
    }
  }
  render () {
    const {currentlyOpenSwipeable} = this.state
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter()
        }
        this.setState({currentlyOpenSwipeable: swipeable})
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null})
    }
    let view
    if (this.state.loading) {
      view = <ActivityIndicator size="large" style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}/>
    } else {
      view =  <FlatList
          data={this.state.data}
          onScroll={this._handleScroll}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => (
            <ProjectItem
              item={item}
              onPress={() => this._onPressItem(item.tfs_id)}
              onPullLeft={ async () => await this._onPullLeft(item._id, index) }
              onCloseProject={ async () => await this._onCloseProject(item._id, index) }
              {...itemProps}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={{borderWidth: 0.5, borderColor: '#999'}} />
          )}
          onRefresh={async () => await this._fetchData() }
          refreshing={this.state.loading}
        />
    }
    return (
     view
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  isLoggedIn: state.auth.isLoggedIn
})
const mapDispatchtoProps = dispatch => ({
  setWorkIds: (project) => dispatch({type: 'WorkItems', project })
})


export default connect(mapStateToProps, mapDispatchtoProps)(ProjectScreen)
