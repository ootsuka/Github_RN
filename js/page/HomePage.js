/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {connect} from 'react-redux'
import { createBottomTabNavigator, createAppContainer} from 'react-navigation'
import {Platform, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'
import NavigationUtil from '../navigator/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import CustomTheme from './CustomTheme'
import actions from '../action/index'
type Props = {};

class HomePage extends Component<Props> {
  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    )
  }
  render() {
    NavigationUtil.navigation = this.props.navigation
    return <View style={{flex: 1}}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible
})

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

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
