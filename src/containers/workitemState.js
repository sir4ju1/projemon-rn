import React from 'react';
import { View, Text, TouchableHighlight, SectionList, Alert, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItemState'
import WorkItemSection from '../components/workItemStatic'
import Icon from 'react-native-vector-icons/MaterialIcons'
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
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Work Items',
    headerTitle: 'Work Items',
    headerRight: (
      <TouchableHighlight underlayColor='#0078d7' activeOpacity={0.5}  style={{ marginRight: 10 }} onPress={() => navigation.navigate('WorkItemCal')}>
        <View>
          <Icon
            name='date-range'
            size={30}
            color='#111' />
        </View>
      </TouchableHighlight>
    )
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
      const response = await fetch('http://ci.lolobyte.com/api/workitems/state', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: this.props.project,
          state: 'Closed',
          isAccepted: false
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
  _handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter()
      
    }
  }
  _onPressItem = async (item, section, index) => {
    try {
      var response = await fetch(`http://ci.lolobyte.com/api/workitems`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          isAccepted: true
        })
      })
      var result = await response.json()
      if (result.success) {
        let items = _.cloneDeep(this.state.data)
        const idx = items.findIndex(i => i._id === section._id)
        items[idx].data.splice(index, 1)
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
      renderItem={({ item, section, index }) => <WorkItem
        item={item}
        type='item'
        onPress={async () => await this._onPressItem(item, section, index)}
        {...itemProps}
      />}
      renderSectionHeader={({ section, index }) => <WorkItemSection
        item={section}
        type='section'
      />}
      sections={this.state.data}
      onScroll={this._handleScroll}
      onRefresh={async () => await this._fetchData()}
      refreshing={this.state.loading}
    />
    )
  }
}
const mapStateToProps = state => ({
  title: state.app.title,
  project: state.app.currentProject,
  workIds: state.app.workIds
})


export default connect(mapStateToProps)(WorkItemScreen)
