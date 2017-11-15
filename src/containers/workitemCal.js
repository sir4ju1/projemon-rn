import React from 'react';
import { View, Text, FlatList, TouchableHighlight, Alert, AsyncStorage, StyleSheet, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import pdfMaker from 'react-native-html-to-pdf'
import FileOpener from 'react-native-file-opener'

class WorkItemScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      data: [],
      project: ''
    }
  }
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Work Calendar',
    headerTitle: 'Work Calendar'
  })

  async componentDidMount() {
    
    const data = await this._fetchData()
    const item = await AsyncStorage.getItem(`p:${this.props.project}`)
    if (item) {
      const project = JSON.parse(item)
      this.setState({ project: project.name })
    }
    
  }
  async componentWillReceiveProps  (next) {
    await this._fetchData()
  }
  _fetchData = async () => {
    try {
      this.setState({loading: true})
      const response = await fetch('http://ci.lolobyte.com/api/workitems/calendar', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: this.props.project
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
  onPressItem = async (item) => {
    try {
      this.setState({loading: true})
      const response = await fetch('http://ci.lolobyte.com/api/workitems/date', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: this.props.project,
          date: item._id
        })
      })
      const result = await response.json()
      if (result.success) {
        
        let elements = `<div>
        <div style="text-align: center;">
          <h2>${this.state.project}</h2>
          <h3>${item._id}</h3>
        </div><div style="font-size: 16px;">`
        result.data.forEach((us, index) => {
          elements += `<div style="padding: 5px 0;"><strong>${index+1}. ${us.title}</strong><div>`
          us.data.forEach((task, idx)=> {
            elements += `<div style="padding-left:20px;">${idx+1}. ${task.title} <span style="padding-left: 10px;"> ${task.isOpt ? '(Extra)': ''}</span></div>`
          })
          elements += '</div></div>'
        })
        elements += '</div></div>'
        // Pdf options
        let options = {
          html: elements,
          fileName: `${this.state.project.toLowerCase()}_${item._id.replace('-', '_')}`,
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
      }
  
      
    } catch (error) {
      Alert.alert(
        'Error',
        error.message,
        [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}]
      )
    }
    this.setState({ loading: false })
    
  }
  render () {
    return (
      <FlatList onScroll={this._handleScroll}
      data={this.state.data}
      keyExtractor={(item, index) => item._id}
      renderItem={({item, index}) => (
        <WorkItem
          item={item}
          onPress={async () => await this.onPressItem(item)}
        />
      )}
      ItemSeparatorComponent={() => (
        <View style={{borderWidth: 1, borderColor: '#ddd'}} />
      )}
      ListEmptyComponent= {() => (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30 }}>
          <Text> Nothing to Show </Text>
        </View>
      )}
      onRefresh={async () => await this._fetchData()}
      refreshing={this.state.loading}
    />
    )
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 7,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: '#aaa',
    width: 56,
    height: 56,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  backlog: {
    backgroundColor: 'yellow',
    width: 5,
    marginRight: 10
  },
  rightSwipeButton: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  }

})
function WorkItem ({ item, onPress }) {
  return (
    <TouchableHighlight
      underlayColor='white'
      activeOpacity={0.5} 
      onPress={() => onPress()} 
    >
    <View style={style.view}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems:'flex-start', paddingHorizontal: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
        { moment(item._id, 'DD-MM-YYYY').format('DD')}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, paddingVertical: 15 }}>
        { moment(item._id, 'DD-MM-YYYY').format('MMMM YYYY')}
        </Text>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end', paddingHorizontal: 10, paddingVertical: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          {item.count}
        </Text>
      </View>
    </View>
    </TouchableHighlight>
  )
}
const mapStateToProps = state => ({
  title: state.app.title,
  project: state.app.currentProject,
  workIds: state.app.workIds
})
export default connect(mapStateToProps)(WorkItemScreen)
