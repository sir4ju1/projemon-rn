import React from 'react';
import { View, Text, FlatList, SectionList, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItemMember'

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
    
    const data = await this._fetchData()
    
  }
  _fetchData = async () => {
    try {
      this.setState({loading: true})
      const response = await fetch('http://ci.lolobyte.com/api/workitems/member', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: this.props.project,
          assignedTo: this.props.member
        })
      })
      const result = await response.json()
      if (result.success) {
        this.setState({ data: result.data })
      }
      
    } catch (error) {
      
    }
    this.setState({ loading: false })
  }
  refreshWorkItems = async () => {
    this.setState({loading: true})
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
    
    return (
      <SectionList
        renderItem={({ item, index }) => <WorkItem
          item={item}
          type='item'
          onPress={() => this.onPressItem(item, index)}
          {...itemProps}
        />}
        renderSectionHeader={({ section, index }) => <WorkItem
          item={section}
          type='section'
          onPress={() => this.onPressItem(section, index)}
          {...itemProps}
        />}
        sections={this.state.data}
        SectionSeparatorComponent={() => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#aaa' }} />
        )}
        
      />
    )
  }
}
const mapStateToProps = state => ({
  title: state.app.title,
  project: state.app.currentProject,
  member: state.app.member
})


export default connect(mapStateToProps)(WorkItemScreen)
