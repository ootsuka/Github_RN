import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl,Image, ActivityIndicator} from 'react-native';
import {createMaterialTopTabNavigator, createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'

import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'

const URL = 'https://github.com/trending/'
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.tabNames = ['All', 'Java', 'Javascript', 'C', 'C#', 'PHP']
  }

  _genTabs() {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={'trending'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
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
    return (
      <View style={{flex: 1, marginTop: 30}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}

const pageSize = 10

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
  }

  componentDidMount() {
    this.loadData()
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props
    const url = this.genFetchUrl(this.storeName)
    const store = this._store()
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callBack => {
        this.refs.toast.show('no more')
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize)
    }

  }

  genFetchUrl(key) {
    return URL + key + '?since=daily'
  }

  renderItem(data) {
    const item = data.item
    return <TrendingItem
      item={item}
      onSelect={() => {}}
      />
  }

  _store() {
    const { trending } = this.props
    let store = trending[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [],
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
          data={store.projectModes}
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
    onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, projectModes, callBack) => dispatch(actions.onLoadMoreTrending(
      storeName, pageIndex, pageSize, projectModes, callBack
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
