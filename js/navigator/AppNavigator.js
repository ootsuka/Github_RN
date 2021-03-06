import { createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createAppContainer
 } from 'react-navigation'
import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers'

import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from '../page/SortKeyPage'
import SearchPage from '../page/SearchPage'

export const rootCom = 'Init'

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null
    }
  }
})

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null
    }
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null
    }
  },
  SortKeyPage: {
    screen: SortKeyPage,
    navigationOptions: {
      header: null
    }
  },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      header: null
    }
  }
})

const SwitchNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
}, {
  navigationOptions: {
    header: null
  }
})

export const RootNavigator = createAppContainer(SwitchNavigator)

export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)

const appWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

const mapStateToProps = state => ({
  state: state.nav
})

export default connect(mapStateToProps)(appWithNavigationState)
