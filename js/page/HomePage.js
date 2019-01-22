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

import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};

export default class HomePage extends Component<Props> {
  _tabNavigator() {
    return createAppContainer(createBottomTabNavigator({
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
    }))
  }
  render() {
    NavigationUtil.navigation = this.props.navigation
    const Tab = this._tabNavigator()
    return <Tab />
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
