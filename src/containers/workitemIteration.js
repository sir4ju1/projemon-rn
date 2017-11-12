import React from 'react';
import { View, Text, FlatList, SectionList, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItemIteration'

class WorkItemScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
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
  refreshWorkItems = async () => {
    this.setState({loading: true})
    this.setState({ data: data.value, loading: false })
  }
  render () {
    return (
      <SectionList
        renderItem={({ item, index }) => <WorkItem
          item={item}
          type='item'
        />}
        renderSectionHeader={({ section, index }) => <WorkItem
          item={section}
          type='section'
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
