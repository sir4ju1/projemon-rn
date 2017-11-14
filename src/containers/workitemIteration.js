import React from 'react';
import { View, Text, FlatList, SectionList, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItemIteration'
import WorkItemSection from '../components/workItemState'

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
  async componentWillReceiveProps  (next) {
    await this._fetchData()
  }
  _fetchData = async () => {
    try {
      this.setState({loading: true})
      const response = await fetch('http://ci.lolobyte.com/api/workitems/milestone', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: this.props.project,
          iteration: this.props.iteration
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
  _onPressSecion = async (item, index) => {
    try {
      const state = 'Closed'
      var response = await fetch(`http://ci.lolobyte.com/api/vsts/wit/state`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          state
        })
      })
      var result = await response.json()
      if (result.success) {
        let items = _.cloneDeep(this.state.data)
        items[index].state = state
        this.setState({ data: items })
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
        renderItem={({ item, index }) => <WorkItem
          item={item}
          type='item'
        />}
        renderSectionHeader={({ section, index }) => <WorkItemSection
          item={section}
          type='section'
          onPress={() => this._onPressSecion(section, index)}
          {...itemProps}
        />}
        sections={this.state.data}
      />
    )
  }
}
const mapStateToProps = state => ({
  title: state.app.title,
  project: state.app.currentProject,
  iteration: state.app.iteration
})


export default connect(mapStateToProps)(WorkItemScreen)
