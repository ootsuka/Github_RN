import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl,Image,
  ActivityIndicator, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import FavoriteDao from '../expand/dao/FavoriteDao'
import FavoriteUtil from '../util/FavoriteUtil'
import {FLAG_STORAGE} from '../expand/dao/DataStore'

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE= 'EVENT_TYPE_TIME_SPAN_CHANGE'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ['All', 'Java', 'Javascript', 'C', 'C#', 'PHP']
    this.state = {
      timeSpan: TimeSpans[0]
    }
  }

  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
        navigationOptions: {
          title: item
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
    if (!this.tabNav) {
      this.tabNav= createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(), {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: '#678'
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle
          }
        }
      ))
    }
    return this.tabNav
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      />
    const TabNavigator = this._tabNav()
    return (
      <View style={{flex: 1, marginTop: 30}}>
        {navigationBar}
        <TabNavigator/>
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const pageSize = 10

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel, timeSpan} = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
  }

  componentDidMount() {
    this.loadData()
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan
      this.loadData()
    })
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove()
    }
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
        this.refs.toast.show('no more')
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }

  }

  genFetchUrl(key) {
    return URL + key + '?' + this.timeSpan.searchText
  }

  renderItem(data) {
    const item = data.item
    return <TrendingItem
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(
        favoriteDao, item,
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
    const { trending } = this.props
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item =>"" + item.fullName}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=> this.loadData()}
              tintColor={THEME_COLOR}
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
