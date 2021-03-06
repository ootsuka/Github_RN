import { combineReducers } from 'redux'

import theme from './theme'
import popular from './popular/index'
import trending from './trending/index'
import favorite from './favorite/index'
import language from './language/index'
import search from './search/index'
import { rootCom, RootNavigator } from '../navigator/AppNavigator'

// assign default state
const navState = RootNavigator.router.getStateForAction(
  RootNavigator.router.getActionForPathAndParams(rootCom))

//create own navigation reducer
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state)
  return nextState || state
}

const index = combineReducers({
  nav: navReducer,
  theme: theme,
  popular: popular,
  trending: trending,
  favorite: favorite,
  language: language,
  search: search
})

export default index
