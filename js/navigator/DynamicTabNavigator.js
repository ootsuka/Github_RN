/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation'
import {Platform, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {BottomTabBar} from 'react-navigation-tabs'

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import NavigationUtil from './NavigationUtil'

type Props = {};
const TABS = { // config routes of pages
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: 'Popular',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: 'Trending',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: 'Favorite',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: 'My',
      tabBarIcon: ({tintColor, focused}) => (
        <AntDesign
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  }
}
export default class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props)
    console.disableYellowBox = true
  }
  _tabNavigator() {
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage} //choose tabs on demand
    PopularPage.navigationOptions.tabBarLabel = 'Popular' //config navigationOptions on demand
    return createAppContainer(createBottomTabNavigator(tabs,{
      tabBarComponent: TabBarComponent
    }))
  }
  render() {
    NavigationUtil.navigation = this.props.navigation
    const Tab = this._tabNavigator()
    return <Tab />
  }
}

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }
  render() {
    const { routes, index } = this.props.navigation.state
    if (routes[index].params) {
      const { theme } = routes[index].params
      if (theme && theme.updateTime > this.theme.updateTime) {
        this.theme = theme
      }
    }
    return <BottomTabBar
           {...this.props}
           activeTintColor = {this.theme.tintColor || this.props.activeTintColor}
      />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
