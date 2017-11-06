import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Button, FlatList, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import DrawerButton from '../components/drawerButton'
import ProjectCard from '../components/projectcard'

class HomeScreen extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      data: []
    }
  }
  static navigationOptions = ({navigation}) => ({
    drawerLabel: 'Home',
    headerTitle: 'Home',
    headerLeft: <DrawerButton navigation={navigation} />,
  })
  async componentWillMount () {
    try {
      const projectIds = await AsyncStorage.getItem('project-stat')
      if (projectIds) {
        const ids = JSON.parse(projectIds)
        let items = []
        for (var index = 0; index < ids.length; index++) {
          const element = ids[index]
          const item = await AsyncStorage.getItem(`p:${element}`)
          items.push(JSON.parse(item))
        }
        this.setState({ data: items })
      } else {
        await this._fetchData()
      }
    } catch (error) {
      console.log(error)
    }
  }
  _fetchData = async () => {
    const response = await fetch('http://ci.lolobyte.com/api/projects/statistic')
    const result = await response.json()
    if (result.success) {
      let ids = []
      for (var index = 0; index < result.data.length; index++) {
        const element = result.data[index]
        ids.push(element._id)
        await AsyncStorage.setItem(`p:${element._id}`, JSON.stringify(element))
      }
      await AsyncStorage.setItem('project-stat', JSON.stringify(ids))
      this.setState({ data: result.data })
    }
  }
  render () {

    return (
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (<ProjectCard item={item}></ProjectCard>)}
          onRefresh={async () => await this._fetchData()}
          refreshing={this.state.refreshing}
        />
    )
  }
}


const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
})
const mapDispatchToProps = dispatch => ({
  store: (token) => dispatch({ type: 'Store', token }),
})


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
