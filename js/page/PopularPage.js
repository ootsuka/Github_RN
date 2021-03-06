import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl,Image,
  ActivityIndicator, DeviceInfo, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataStore'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import FavoriteUtil from '../util/FavoriteUtil'
import EventTypes from '../util/EventTypes'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
class PopularPage extends Component<Props> {
  constructor(props) {
    super(props)
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_key)
  }

  _genTabs() {
    const tabs = {}
    const {keys, theme} = this.props
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  renderRightButton() {
    const {theme} = this.props
    return <TouchableOpacity
      onPress={() => {
        NavigationUtil.goPage({theme}, 'SearchPage')
      }}
      >
      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white'
          }}
          />
      </View>
    </TouchableOpacity>
  }

  render() {
    const {keys, theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'popular'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
      />
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(), {
        tabBarOptions: {
          tabStyle: theme.styles.tabBarSelectedIcon,
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
    )) : null
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

const pageSize = 10

class PopularTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
    this.isFavoriteChanged = false
  }

  componentDidMount() {
    this.loadData()
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangedListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true)
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener)
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
        this.refs.toast.show('no more')
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }

  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR
  }

  renderItem(data) {
    const item = data.item
    const {theme} = this.props
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callBack) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callBack
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(
        favoriteDao, item,
        isFavorite, FLAG_STORAGE.flag_popular)}
      />
  }

  _store() {
    const { popular } = this.props
    let store = popular[this.storeName]
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
    const { popular, theme } = this.props
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item =>"" + item.item.id}
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
    popular: state.popular
  })

const mapDispatchToProps = (dispatch) => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, projectModels, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(
      storeName, pageIndex, pageSize, projectModels, favoriteDao, callBack
    )),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, projectModels, favoriteDao) => dispatch(actions.onFlushPopularFavorite(
      storeName, pageIndex, pageSize, projectModels, favoriteDao
    )),
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

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
