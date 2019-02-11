import React, {Component} from 'react'
import {ScrollView, Button, StyleSheet, Text, View, TouchableOpacity,
  DeviceInfo, Linking, Clipboard} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Toast from 'react-native-easy-toast'

import {MORE_MENU} from '../../common/MORE_MENU'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtil from '../../util/ViewUtil'
import NavigationUtil from '../../navigator/NavigationUtil'
import {FLAG_ABOUT} from './AboutCommon'
import config from '../../res/data/github_app_config'
import AboutCommon from './AboutCommon'

const THEME_COLOR = '#678'

type Props = {};
export default class AboutMePage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    }, data => this.setState({...data}))
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    }
  }
  onClick(tab) {
    if (!tab) return
    if (tab.url) {
      NavigationUtil.goPage({
        title: tab.title,
        url: tab.url
      }, 'WebViewPage')
      return
    }
    if (tab.account && tab.account.indexOf('@') > -1) {
      let url = 'mailto://' + tab.account
      Linking.canOpenURL(url).then(support => {
        if (!support) {
          console.log('cannot handle url: ' + url)
        } else {
          Linking.openURL(url)
        }
      }).catch(e => {
        console.error('an error occured ' + e)
      })
      return
    }
    if (tab.account) {
      Clipboard.setString(tab.account)
      this.toast.show(tab.title + tab.account + 'copied to clipboard')
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
  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, THEME_COLOR, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }
  renderItems(dic, isShowAccount) {
    if (!dic) return null
    let views = []
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, THEME_COLOR)}
          <View style={GlobalStyles.line} />
        </View>
      )
    }
    return views
  }
  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line} />
      {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyles.line} />
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyles.line} />
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyles.line} />
      {this.state.showQQ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

    </View>
    return <View style={{flex: 1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast = toast}
             position={'center'}
      />
    </View>
  }
}
