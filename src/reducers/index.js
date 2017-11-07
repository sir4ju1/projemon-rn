import { combineReducers } from 'redux';

const initialAppState = {
  title: 'Home',
  currentProject: '',
  workIds: []
}
function app(state = initialAppState, action) {
  switch(action.type) {
    case 'WorkItems':
      return { ...state, currentProject: action.project, member: action.member, iteration: action.iteration, workIds: action.workIds }
    default:
      return state
  }
}

const initialAuthState = { token: '', isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Store':
      return { ...state, token: action.token, isLoggedIn: true }
    case 'Logout':
      return { ...state, token: '', isLoggedIn: false }
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  app,
  auth,
});

export default AppReducer
