import { combineReducers } from 'redux';
// import { NavigationActions } from 'react-navigation';
// import { AppNavigator } from '../navigators'

// // Start with two routes: The Main screen, with the Login screen on top.
// const firstAction = AppNavigator.router.getActionForPathAndParams('Home')
// const tempNavState = AppNavigator.router.getStateForAction(firstAction)
// const initialNavState = AppNavigator.router.getStateForAction(
//   firstAction,
//   tempNavState
// );

// function nav(state = initialNavState, action) {
//   let nextState;
//   switch (action.type) {
//     case 'Home':
//     case 'Projects':
//     case 'WorkItems':
//       nextState = AppNavigator.router.getStateForAction(
//         NavigationActions.navigate({ routeName: action.type }),
//         state
//       )
//       nextState.workIds = action.workIds
//       break
//     default:
//       nextState = AppNavigator.router.getStateForAction(action, state);
//       break
//   }
//   nextState.title = action.type
//   // Simply return the original `state` if `nextState` is null or undefined.
//   return nextState || state;
// }
const initialAppState = {
  title: 'Home',
  currentProject: '',
  workIds: []
}
function app(state = initialAppState, action) {
  switch(action.type) {
    case 'WorkItems':
      return { ...state, currentProject: action.project, workIds: action.workIds }
    default:
      return state
  }
}

const initialAuthState = { token: '', isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Store':
      return { ...state, token: action.token, isLoggedIn: true };
    case 'Logout':
      return { ...state, token: '', isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  app,
  auth,
});

export default AppReducer
