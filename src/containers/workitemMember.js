import React from 'react';
import { View, Text, FlatList, SectionList, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import WorkItem from '../components/workItemMember'
import WorkItemSection from '../components/workItemStatic'
import _ from 'lodash'

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
  async componentWillReceiveProps  (next) {
    await this._fetchData()
  }
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
  
  _onActivate = async (item) => {
    try {
      const state = item.item.state === 'New' ? 'Active' : item.item.state === 'Active' ? 'New' : 'New'
      var response = await fetch(`http://ci.lolobyte.com/api/vsts/wit/state`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.item._id,
          state
        })
      })
      var result = await response.json()
      if (result.success) {
        const items = _.cloneDeep(this.state.data)
        const section = items.filter(i => i._id === item.section._id)
        section[0].data[item.index].state = state
        this.setState({ data: items })
        await this.props.navigation.state.params.refresh()
      }
      
    } catch (error) {
      
    }
    
  }
  _onClosePress = async (item) => {
    try {
      if (item.item.state === 'New') return false
      const state = 'Closed'
      var response = await fetch(`http://ci.lolobyte.com/api/vsts/wit/state`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.item._id,
          state
        })
      })
      var result = await response.json()
      if (result.success) {
        let items = _.cloneDeep(this.state.data)
        const section = items.findIndex(i => i._id === item.section._id)
        const idx = section
        items[idx].data.splice(item.index, 1)
        if (items[idx].data.length === 0) {
          items.splice(idx, 1)
        }
        this.setState({ data: items })
        await this.props.navigation.state.params.refresh()
      }
      
    } catch (error) {
      console.log(error.message)
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
    
    return (
      <SectionList
        renderItem={(item) => <WorkItem
          item={item.item}
          type='item'
          onActivate={async () => await this._onActivate(item)}
          onClosePress={async () => await this._onClosePress(item)}
          {...itemProps}
        />}
        renderSectionHeader={({ section, index }) => <WorkItemSection
          item={section}
          type='section'          
          {...itemProps}
        />}
        sections={this.state.data}
        SectionSeparatorComponent={() => (
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#aaa' }} />
        )}
        onScroll={this._handleScroll}
        onRefresh={async () => await this._fetchData() }
        refreshing={this.state.loading}
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
