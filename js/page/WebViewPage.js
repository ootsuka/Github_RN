import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, WebView, TouchableOpacity,
DeviceInfo} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import NavigationUtil from '../navigator/NavigationUtil'
import FavoriteDao from '../expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

type Props = {};
export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { title, url } = this.params
    this.state= {
      title: title,
      url: url,
      canGoBack: false,
    }
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }
  onBackPress() {
    this.onBack()
    return true
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navigationBar = <NavigationBar
      title={this.state.title}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  }
});
