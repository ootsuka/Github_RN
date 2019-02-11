import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl,Image,
  ActivityIndicator, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EventBus from 'react-native-event-bus'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import FavoriteDao from '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import {FLAG_STORAGE} from '../expand/dao/DataStore'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import EventTypes from '../util/EventTypes'
import ArrayUtil from '../util/ArrayUtil'

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const EVENT_TYPE_TIME_SPAN_CHANGE= 'EVENT_TYPE_TIME_SPAN_CHANGE'

type Props = {};
class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props)
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_language)
    this.state = {
      timeSpan: TimeSpans[0]
    }
    this.preKeys = []
  }

  _genTabs() {
    const tabs = {}
    const {keys, theme} = this.props
    this.preKeys = keys
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  renderTitleView() {
    return <View>
      <TouchableOpacity
        ref='button'
        underlayColor='transparent'
        onPress={() => this.dialog.show()}
        >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{
              fontSize: 18,
              color: '#FFFFFF',
              fontWeight: '400'
            }}>
            trending {this.state.timeSpan.showText}
          </Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: 'white'}}
            />
        </View>
      </TouchableOpacity>
    </View>
  }

  onSelectTimeSpan(tab) {
    this.dialog.dismiss()
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
  }

  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
      />
  }

  _tabNav() {
    const {theme} = this.props
    if (this.theme !== theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
      this.theme = theme
      this.tabNav= createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(), {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: theme.themeColor
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle
          },
          lazy: true
        }
      ))
    }
    return this.tabNav
  }

  render() {
    const {keys, theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
      />
    const TabNavigator = keys.length ? this._tabNav() : null
    return (
      <View style={{flex: 1, marginTop: 30}}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme
})
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)

const pageSize = 10

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel, timeSpan} = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
    this.isFavoriteChanged = false
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

  }

  componentDidMount() {
    this.loadData()
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan
      this.loadData()
    })
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangedListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove()
    }
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, this.favoriteDao, callBack => {
        this.refs.toast.show('no more')
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, this.favoriteDao)
    } else {
      onRefreshTrending(this.storeName, url, pageSize, this.favoriteDao)
    }

  }

  genFetchUrl(key) {
    return URL + key + '?' + this.timeSpan.searchText
  }

  renderItem(data) {
    const item = data.item
    const {theme} = this.props
    return <TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(
        this.favoriteDao, item,
        isFavorite, FLAG_STORAGE.flag_trending)}
      />
  }

  _store() {
    const { trending } = this.props
    let store = trending[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
        hideLoadingMore: true,
      }
    }
    return store
  }

  getIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
          />
        <Text>Loading More</Text>
      </View>
  }

  render() {
    const { trending, theme } = this.props
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item =>"" + item.item.fullName}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={()=> this.loadData()}
              tintColor={theme.themeColor}
              />
          }
          ListFooterComponent={() => this.getIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true
          }}
          />
        <Toast
          ref={'toast'}
          position={'center'}
          />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
    trending: state.trending
  })

const mapDispatchToProps = (dispatch) => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, projectModels, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(
      storeName, pageIndex, pageSize, projectModels, favoriteDao, callBack
    )),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, projectModels, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(
      storeName, pageIndex, pageSize, projectModels, favoriteDao
    ))
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
