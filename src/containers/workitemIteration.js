import React from 'react';
import { View, Text, TouchableHighlight, SectionList, Alert, ActivityIndicator, AsyncStorage, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux'

import vsts from '../api/common'
import WorkItem from '../components/workItemIteration'
import WorkItemSection from '../components/workItemIterSec'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import pdfMaker from 'react-native-html-to-pdf'
import FileOpener from 'react-native-file-opener'

class WorkItemScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      currentlyOpenSwipeable: null,
      project: '',
      data: []
    }
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
    drawerLabel: 'Work Items',
    headerTitle: 'Work Items',
    headerRight: (
      <TouchableHighlight underlayColor='#0078d7' activeOpacity={0.5}  style={{ marginRight: 10 }}
        onPress={ params.print ? async () => await params.print() : () => null}>
        <View>
          <Icon
            name='print'
            size={30}
            color='#111' />
        </View>
      </TouchableHighlight>
    )}
  }

  async componentDidMount() {
    
    const data = await this._fetchData()
    const item = await AsyncStorage.getItem(`p:${this.props.project}`)
    if (item) {
      const project = JSON.parse(item)
      this.setState({ project: project.name })
    }
    this.props.navigation.setParams({ print: this._onPrint })
    
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
  _onPressSecion = async (item) => {
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
        const index = items.findIndex(i => i._id === item._id)
        items[index].state = state
        this.setState({ data: items })
      }
    } catch (error) {
      console.log(error.message)
    }
    this.state.currentlyOpenSwipeable.recenter()
    
  }
  _onExtraItem = async (item, section, index) => {
    try {
      const isOpt = item.isOpt ? false : true
      var response = await fetch(`http://ci.lolobyte.com/api/workitems`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          isOpt
        })
      })
      var result = await response.json()
      if (result.success) {
        let items = _.cloneDeep(this.state.data)
        const idx = items.findIndex(i => i._id === section._id)
        items[idx].data[index].isOpt = isOpt
        this.setState({ data: items })
        this.currentlyOpenSwipeable.recenter()
      }
    } catch (error) {
      console.log(error.message)
    }
    
  }
  _onPrint = async () => {
    try {
      let elements = `<div>
      <div style="text-align: center;">
        <h2>${this.state.project}</h2>
        <h3>${this.props.iteration}</h3>
      </div><div style="font-size: 16px;">`
      this.state.data.forEach((us, index) => {
        elements += `<div style="font-size: 14px; padding: 5px 0;"><strong>${index+1}. ${us.title}</strong><div>`
        us.data.forEach((task, idx)=> {
          elements += `<div style="padding-left:20px;">${idx+1}. ${task.title} <span style="padding-left: 10px; font-weight: 600">(${task.state})  ${task.isOpt ? '(Extra)': ''}</span></div>`
        })
        elements += '</div></div>'
      })
      elements += '</div></div>'
      // Pdf options
      let options = {
        html: elements,
        fileName: `${this.state.project.toLowerCase()}_${this.props.iteration.replace(' ', '_')}`,
        directory: 'docs',
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )
      let filePath = ''
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        file = await pdfMaker.convert(options)
        filePath = file.filePath
        await FileOpener.open(filePath, 'application/pdf')
        
      } else {
        Alert.alert(
          'Error',
          'Permission Denied',
          [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}]
        )
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message,
        [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}]
      )
    }
  }
  _handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter()
      
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
          onPress={async () => await this._onExtraItem(item, section, index)}
          {...itemProps}
        />}
        renderSectionHeader={({ section }) => <WorkItemSection
          item={section}
          type='section'
          onPress={() => this._onPressSecion(section)}
          {...itemProps}
        />}
        sections={this.state.data}
        onScroll={this._handleScroll}
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
