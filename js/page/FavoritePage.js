import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl,Image,
  ActivityIndicator, DeviceInfo} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../expand/dao/DataStore'
import FavoriteUtil from '../util/FavoriteUtil'
import EventTypes from '../util/EventTypes'


const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

type Props = {};
export default class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ['Popular', 'Trending']
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'Favorite'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
      'Popular' : {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
        navigationOptions: {
          title: 'Popular'
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
        navigationOptions: {
          title: 'Trending'
        }
      }
    }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          style: {
            backgroundColor: '#678'
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }
    ))
    return (
      <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}

const pageSize = 10

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {flag} = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(flag)
  }

  componentDidMount() {
    this.loadData()
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 2) {
        this.loadData(false)
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener)
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  renderItem(data) {
    const item = data.item
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(
        favoriteDao, item,
        isFavorite, this.storeName)}
      />
  }

  _store() {
    const { favorite } = this.props
    let store = favorite[this.storeName]
    if (!store) {
      store = {
        items: [],
        isShowLoading: false,
        projectModels: [],
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
    const { popular } = this.props
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item =>"" + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=> this.loadData(true)}
              tintColor={THEME_COLOR}
              />
          }
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
    favorite: state.favorite
  })

const mapDispatchToProps = (dispatch) => ({
    onLoadFavoriteData: (flag, isShowLoading) => dispatch(actions.onLoadFavoriteData(flag, isShowLoading))
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)

const styles = StyleSheet.create({
  tabStyle: {
    minWidth: 100
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
})
