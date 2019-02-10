import React, {Component} from 'react';
import {
  StyleSheet, Text, View, Button ,Image,
  DeviceInfo, ScrollView, TouchableOpacity,
  Alert, TouchableHighlight
} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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

class SortKeyPage extends Component<Props> {
  constructor(props) {
      super(props);
      this.params = this.props.navigation.state.params;
      this.languageDao = new LanguageDao(this.params.flag);
      this.state = {
          checkedArray: SortKeyPage._keys(this.props),
      }
  }


  componentDidMount() {
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
    if (prevState.checkedArray.length === 0) {
      return {
        checkedArray: checkedArray
      }
    }
    return null
  }


  static _keys(props, state) {
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    const flag = SortKeyPage._flag(props)
    let dataArray = props.language[flag] || []
    let keys = []
    for (let i = 0, l = dataArray.length; i < l; i++) {
      let data = dataArray[i]
      if (data.checked) keys.push(data)
    }
    return keys
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
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

  onSave(hasChecked) {
    if (!hasChecked) {
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return
      }
    }
    //todo: save sorted data
    //fetch sorted data

    this.languageDao.save(this.getSortResult())
    //reload for other tab to get updated data
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  onBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
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


  getSortResult() {
    const flag = SortKeyPage._flag(this.props)
    //copy data from original
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    //get data from before sorting
    const originalCheckedArray = SortKeyPage._keys(this.props)
    for (let i = 0, l = originalCheckedArray.length; i < l; i++) {
      let item = originalCheckedArray[i]
      let index = this.props.language[flag].indexOf(item)
      sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
    return sortResultArray
  }


  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'Sort Language' : 'Sort Key'
    let navigationBar = <NavigationBar
      title={title}
      rightButton={SortKeyPage.getRightButton('save', () => this.onSave())}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      style={{backgroundColor: THEME_COLOR}}
      />
    return <View style={styles.container}>
      {navigationBar}
      <SortableListView
        style={{ flex: 1 }}
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} />}
      />
    </View>
  }
}
class SortCell extends Component {
  render() {
    return <TouchableHighlight
        underlayColor={'#eee'}
        style={this.props.data.checked ? styles.item : styles.hidden}
         {...this.props.sortHandlers}
        >
        <View style={{marginLeft: 10, flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name={'sort'}
            size={16}
            style={{marginRight: 10, color: THEME_COLOR}}
            />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
  }
}

const mapPopularStateToProps = state => ({
  language: state.language
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  }

});
