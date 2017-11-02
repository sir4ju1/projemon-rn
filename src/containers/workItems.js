import React from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItem'

class WorkItemScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      currentlyOpenSwipeable: null,
      data: []
    }
  }
  static navigationOptions = () => ({
    drawerLabel: 'Work Items',
    headerTitle: 'Work Items',
  })

  async componentDidMount() {
    this.setState({loading: true})
    const data = await vsts.getWorkItems(this.props.workIds)
    this.setState({ data: data.value, loading: false })
  }
  refreshWorkItems = async () => {
    this.setState({loading: true})
    const ids = await vsts.getProjectWorkIds(this.props.project)
    const data = await vsts.getWorkItems(ids)
    this.setState({ data: data.value, loading: false })
  }
  _handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter()
      
    }
  }
  onPressItem = async (item, index) => {
    // Alert.alert(
    //   item.fields['System.State'],
    //   'Change Status',
    //   [
    //     {text: 'Close', onPress: () => console.log('Ask me later pressed')},
    //     {text: 'Done', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {text: 'Cancel', onPress: () => console.log('OK Pressed')},
    //   ],
    //   { cancelable: false }
    // )
    let result = await vsts.closeWorkItem(item.id)
    console.log(result)
    let items = this.state.data
    items.splice(index, 1)
    this.setState({ data: items })
    // this._handleScroll()
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
      view = <FlatList onScroll={this._handleScroll}
                data={this.state.data}
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => (
                  <WorkItem
                    item={item}
                    onPress={() => this.onPressItem(item, index)}
                    {...itemProps}       
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View style={{borderWidth: 0.5, borderColor: '#eee'}} />
                )}
                ListEmptyComponent= {() => (
                  <View style={{flex: 1, alignItems: 'center', marginTop: 30 }}>
                    <Text> Nothing to Show </Text>
                  </View>
                )}
                onRefresh={() => this.refreshWorkItems}
                refreshing={this.state.loading}
              />
    }
    return (
      view
    )
  }
}
const mapStateToProps = state => ({
  title: state.app.title,
  project: state.app.currentProject,
  workIds: state.app.workIds
})


export default connect(mapStateToProps)(WorkItemScreen)
