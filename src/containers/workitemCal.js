import React from 'react';
import { View, Text, FlatList, AsyncStorage, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import vsts from '../api/common'
// import WorkItem from '../components/workItemCal'

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
    drawerLabel: 'Work Calendar',
    headerTitle: 'Work Calendar'
  })

  async componentDidMount() {
    
    const data = await this._fetchData()
    
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
    try {
      
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

    return (
      <FlatList onScroll={this._handleScroll}
      data={this.state.data}
      keyExtractor={(item, index) => item._id}
      renderItem={({item, index}) => (
        <WorkItem
          item={item}
          // onPress={() => this.onPressItem(item, index)}
          // {...itemProps}
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
      onRefresh={() => this.refreshWorkItems}
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
const style = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',   
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 15
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
function WorkItem ({ item }) {
  return (
    <View style={style.view}>
      <View style={style.backlog} />
      <View style={{ paddingRight: 10, paddingVertical: 10 }}>
        <Text style={style.title}>
          {item._id}
        </Text>
        <Text style={{ fontSize: 12 }}>
          {item.count}
        </Text>
      </View>
    </View>
  )
}

export default connect(mapStateToProps)(WorkItemScreen)
