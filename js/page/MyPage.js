/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {ScrollView, Button, StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'

import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import {MORE_MENU} from '../common/MORE_MENU'
import GlobalStyles from '../res/GlobalStyles'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'

const THEME_COLOR = '#678'

type Props = {};
class MyPage extends Component<Props> {
  onClick(menu) {
    let RouteName, params = {}
    switch (menu) {
      case MORE_MENU.Tutorial:
      RouteName = 'WebViewPage'
      params.title = 'Tutorial'
      params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
      break
      case MORE_MENU.About:
      RouteName = 'AboutPage'
      break
      case MORE_MENU.About_Author:
      RouteName = 'AboutMePage'
      break
      case MORE_MENU.Sort_Key:
      RouteName = 'SortKeyPage'
      params.flag = FLAG_LANGUAGE.flag_key
      break
      case MORE_MENU.Sort_Language:
      RouteName = 'SortKeyPage'
      params.flag = FLAG_LANGUAGE.flag_language
      break
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
      RouteName = 'CustomKeyPage'
      params.isRemoveKey = menu === MORE_MENU.Remove_Key
      params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
      break
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar =
      <NavigationBar
        title={'My'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        />

    const { navigation } = this.props
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
            >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{
                  marginRight: 10,
                  color: THEME_COLOR
                }}
                />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: THEME_COLOR
              }}/>
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          <Text style={styles.groupTitle}>Trending Management</Text>
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}
          <View style={GlobalStyles.line} />
          <Text style={styles.groupTitle}>Popular Management</Text>
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}
          <View style={GlobalStyles.line} />
          <Text style={styles.groupTitle}>Setting</Text>
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
    fontSize: 12,
    color: 'gray'
  }
});

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)
