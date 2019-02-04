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
import { connect } from 'react-redux'
import EventBus from 'react-native-event-bus'

import EventTypes from '../util/EventTypes'
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

class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props)
    console.disableYellowBox = true
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage} //choose tabs on demand
    PopularPage.navigationOptions.tabBarLabel = 'Popular' //config navigationOptions on demand
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs,{
      tabBarComponent: props => {
        return <TabBarComponent theme={this.props.theme} {...props}/>
      }
    }))
  }
  render() {
    const Tab = this._tabNavigator()
    return <Tab
      onNavigationStateChange={(prevState, newState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
          from : prevState.index,
          to: newState.index
        })
      }}
      />
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

    return <BottomTabBar
           {...this.props}
           activeTintColor = {this.props.theme}
      />
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme
})

export default connect(mapStateToProps)(DynamicTabNavigator)
