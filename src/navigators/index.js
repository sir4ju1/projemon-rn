import React from 'react'
import PropTypes from 'prop-types'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import { connect } from 'react-redux'


import LoginScreen from '../containers/login'
import HomeScreen from '../containers/home'
import ProjectScreen from '../containers/projects'
import WorkItemScreen from '../containers/workItems'
import DrawerButton from '../components/drawerButton'
import DrawerView from '../components/drawerView'

const HomeNavigator = StackNavigator({ 
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  }
}, {
  initialRouteName: 'Home', 
  navigationOptions: () => (
    {
      headerStyle: {backgroundColor: '#0078d7'}
    }
  )

}
)
const ProjectNavigator = StackNavigator({ 
  Projects: {
    screen: ProjectScreen,
  },
  WorkItems: {
    screen: WorkItemScreen
  }
}, {
  navigationOptions: () => (
    {
      headerStyle: {backgroundColor: '#0078d7'}
    }
  )
})

const AppNavigator = DrawerNavigator({
    Home: {
      screen: HomeNavigator,
    },
    Projects: {
      screen: ProjectNavigator
    }
  },
  {
    contentComponent: DrawerView,
  }
)
// class AppWithNavigationState extends React.Component {
//   render() {
//     return (
//       <AppNavigator navigation={addNavigationHelpers({
//         dispatch: this.props.dispatch,
//         state: this.props.nav,
//       })} />
//     )
//   }
// }

// AppWithNavigationState.PropTypes = {
//   dispatch: PropTypes.func.isRequired,
//   nav: PropTypes.object.isRequired
// }
// const mapStateToProps = state => ({
//   app: state.app
// })

export default AppNavigator
// export default connect(mapStateToProps)(AppNavigator)
