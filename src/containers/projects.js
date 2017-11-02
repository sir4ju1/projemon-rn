import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import DrawerButton from '../components/drawerButton'
import ProjectItem from '../components/projectItem'

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
    this._handleScroll()
    this.setState({loading: true})
    // vsts.setToken(this.props.token)
    const data = await vsts.getProjects()
    this.setState({ data, loading: false})
  }

  _handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  }

  _onPressItem = (project, workIds) => {
    this.props.setWorkIds(project, workIds)
    this.props.navigation.navigate('WorkItems')
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
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <ProjectItem
              item={item}
              onPress={() => this._onPressItem(item.name, item.workIds)}
              {...itemProps}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={{borderWidth: 0.5, borderColor: '#eee'}} />
          )}
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
  setWorkIds: (project, ids) => dispatch({type: 'WorkItems', project, workIds: ids })
})


export default connect(mapStateToProps, mapDispatchtoProps)(ProjectScreen)
