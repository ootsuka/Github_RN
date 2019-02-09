import React, {Component} from 'react';
import {
  StyleSheet, Text, View, Button ,Image,
  DeviceInfo, ScrollView, TouchableOpacity,
  Alert,
} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataStore'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import FavoriteUtil from '../util/FavoriteUtil'
import ViewUtil from '../util/ViewUtil'
import EventTypes from '../util/EventTypes'
import LanguageDao from '../expand/dao/LanguageDao'
import ArrayUtil from '../util/ArrayUtil'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
class CustomKeyPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.changeValues = []
    this.isRemoveKey = !!this.params.isRemoveKey
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }
  componentDidMount() {
    if (CustomKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState)
      }
    }
    return null
  }
  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    if (isRemoveKey && !original) {
      return state && state.keys && state.keys !== 0 && state.keys || props.languages[key].map(
        val => {
          return {
          ...val,
          checked: false
        }
      })
    } else {
      return props.languages[key]
    }
  }
  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callBack}
      >
      <Text
        style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}
        >
        {title}
      </Text>
    </TouchableOpacity>
  }
  _genTabs() {
    const tabs = {}
    const {keys} = this.props
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }
  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation)
      return
    }
    let keys;
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name')
      }
    }
    this.languageDao.save(keys || this.state.keys)
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }
  onBack() {
    if (this.changeValues.length > 0) {
      Alert.alert('reminder', 'do you want to save the change?',
      [
        {
          text: 'No', onPress: () => {
            NavigationUtil.goBack(this.props.navigation)
          }
        },
        {
          text: 'Yes', onPress: () => {
            this.onSave()
          }
        }
      ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }

  }
  renderView() {
    let dataArray = this.state.keys
    if (!dataArray || dataArray.length == 0) return
    let len = dataArray.length
    let views = []
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < len ? this.renderCheckBox(dataArray[i+1], i+1) : null}
          </View>
          <View style={styles.line}/>
        </View>
      )
    }
    return views
  }
  onClick(data, index) {
    data.checked = !data.checked
    ArrayUtil.updateArray(this.changeValues, data)
    this.state.keys[index] = data
    this.setState({
      keys: this.state.keys
    })
  }
  _checkedImage(checked) {
    const {theme} = this.params
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{
        color: THEME_COLOR,
      }}
      />
  }
  renderCheckBox(data, index) {
    return <CheckBox
    style={{flex: 1, padding: 10}}
    onClick={()=> this.onClick(data, index)}
    isChecked={data.checked}
    leftText={data.name}
    checkedImage={this._checkedImage(true)}
    unCheckedImage={this._checkedImage(false)}
/>
  }
  render() {
    const {keys} = this.props
    let title = this.isRemoveKey ? 'remove key' : 'custom key'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'custom language' : title
    let rightButtonTitle = this.isRemoveKey ? 'remove' : 'save'
    let navigationBar = <NavigationBar
      title={title}
      rightButton={CustomKeyPage.getRightButton(rightButtonTitle, () => this.onSave())}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      style={{backgroundColor: THEME_COLOR}}
      />
    return <View sytle={styles.container}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}

const mapPopularStateToProps = state => ({
  languages: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  }

});
