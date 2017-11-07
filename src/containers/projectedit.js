import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'

class ProjectEdit extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      project: {},
      iterations: [],
      repos: []
    }
  }
  static navigationOptions = ({ navigation }) => ({
    drawerLabel: 'Project Edit',
    headerTitle: 'Project Edit'
  })
  async componentWillMount () {
    const item = await AsyncStorage.getItem(`p:${this.props.project}`)
    if (item) {
      const project = JSON.parse(item)
      this.setState({ project: project, iterations: project.iterations, repos: project.repos })
    }
  }

  _onWorkItemPress = async (id) => {
    try {
      this.setState( { loading: true })
      var response = await fetch(`http://ci.lolobyte.com/api/vsts/${id}/workitems`)
      var result = await response.json()
      if (result.success) {
        await AsyncStorage.removeItem(`project-stat`)
      }      
    } catch (error) { }
    this.setState( { loading: false })
  }
  _onReloadPress = async (id) => {
    try {
      this.setState( { loading: true })
      var response = await fetch(`http://ci.lolobyte.com/api/vsts/project/${id}/import`)
      var result = await response.json()
      if (result.success) {
        await AsyncStorage.removeItem(`project-stat`)
      }
    } catch (error) {
      
    }
    this.setState( { loading: false })
  }
  _onReleasePress = async (id, index) => {
    try {
      this.setState( { loading: true })
      var response = await fetch(`http://ci.lolobyte.com/api/projects/${id}/release`, {
        method: 'patch',
        headers: { 'Content-Type': 'application/json' }
      })
      var result = await response.json()
      if (result.success) {
        const items = _.cloneDeep(this.state.iterations)
        items[index].status = 'released'
        const project = _.cloneDeep(this.state.project)
        project.iterations[index] = items[index]
        this.setState({ project, iterations: items })
        await AsyncStorage.setItem(`p:${this.props.project}`, JSON.stringify(project))
      }
    } catch (error) {
      
    }
    this.setState( { loading: false })
  }
  render () {
    return (
      <ScrollView>
        <View style={{ flex: 1, flexDirection: 'column', flexBasis: 1, backgroundColor: 'white', borderRadius: 2, borderColor: '#ddd', borderWidth: 1, margin: 5, padding: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 5 }}>
            <Text style={{ fontSize: 18 }}>
              {this.state.project.name}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              
                {
                  this.state.loading === false ?
                  (
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableHighlight style={{ marginRight: 10 }} onPress={async () => { await this._onWorkItemPress(this.state.project.tfs_id) }}>
                    <View>
                      <Icon
                        name='repeat'
                        size={24}
                        color='gray' />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={async () => { await this._onReloadPress(this.state.project.tfs_id) }}>
                    <View>
                      <Icon
                        name='cached'
                        size={24}
                        color='gray' />
                    </View>
                  </TouchableHighlight>
                  </View>
                  ) :
                  <ActivityIndicator />
                }
              
            </View>
          </View>

          
          <View style={{ marginTop: 5, marginBottom: 10 }}>
            <Text style={{ fontSize: 12 }}>
              {this.state.project.description}
            </Text>
          </View>
          <View style={{ borderColor: '#ddd', borderBottomWidth: 1, marginVertical: 5 }}>
            <Text style={{ fontSize: 14 }}>
              Milestones
          </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {
              this.state.iterations.map((it, index) => {
                return (

                  <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 5 }} key={it._id}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {it.name}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {
                      it.status === 'plan' ?
                          (
                            <TouchableHighlight onPress={async () => { await this._onReleasePress(it._id, index) }}>
                              <View>
                                <Icon
                                  name='check-box-outline-blank'
                                  size={24}
                                  color='gray' />
                              </View>
                            </TouchableHighlight>) :
                            <Icon
                            name='check-box'
                            size={24}
                            color='#5f5' />
                    }
                      
                    </View>
                  </View>

                )
              })
            }
          </View>
          <View style={{ borderColor: '#ddd', borderBottomWidth: 1, marginVertical: 5 }}>
            <Text style={{ fontSize: 14 }}>
              Repo
          </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {
              this.state.repos.map(re => {
                return (
                  <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 10 }} key={re._id}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {re.name}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <TouchableHighlight onPress={()=>{}}>
                          <View>
                            <Icon
                              name='mode-edit'
                              size={24}
                              color='gray' />
                          </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  isLoggedIn: state.auth.isLoggedIn,
  project: state.app.currentProject
})

export default connect(mapStateToProps)(ProjectEdit)
