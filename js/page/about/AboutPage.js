import React, {Component} from 'react'
import {ScrollView, Button, StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'

import {MORE_MENU} from '../../common/MORE_MENU'
import GlobalStyles from '../../res/GlobalStyles'
import ViewUtil from '../../util/ViewUtil'
import NavigationUtil from '../../navigator/NavigationUtil'
import {FLAG_ABOUT} from './AboutCommon'
import config from '../../res/data/github_app_config'
import AboutCommon from './AboutCommon'

const THEME_COLOR = '#678'

type Props = {};
export default class AboutPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    }, data => this.setState({...data}))
    this.state = {
      data: config
    }
  }
  onClick(menu) {
    let RouteName, params = {}
    switch (menu) {
      case MORE_MENU.Tutorial:
      RouteName = 'WebViewPage'
      params.title = 'Tutorial'
      params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }
  getRightButton() {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {

        }}
        >
        <View style={{padding:5, marginRight: 8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color: 'white'}}
            />
        </View>
      </TouchableOpacity>
    </View>
  }

  getLeftButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callBack}
      >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: 'white'}}
        />
    </TouchableOpacity>
  }
  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
  }
  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line} />
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line} />
      {this.getItem(MORE_MENU.Feedback)}

    </View>
    return this.aboutCommon.render(content, this.state.data.app)
  }
}
