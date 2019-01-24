/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput} from 'react-native';

import DataStore from '../expand/dao/DataStore'

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      showText: ''
    }
    this.dataStore = new DataStore()
  }
  loadData() {
    let url = `http://api.github.com/search/repositories?q=${this.value}`
    this.dataStore.fetchData(url)
        .then(data => {
          let showData = `first data loading time: ${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
          this.setState({
            showText: showData
          })
        }).catch(error => {
          error && console.log(error.toString())
        })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DataStoreDemoPage</Text>
        <TextInput style={styles.input}
          onChangeText={(text) => {
            this.value = text
          }}
          />
        <Text onPress={() => {
            this.loadData()
          }}>
          fetch Data
        </Text>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 40, width:100,borderColor: 'gray', borderWidth: 1,marginTop:20
  }
});
