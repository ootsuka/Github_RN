import React from 'react'
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {

  static getSettingItem(callBack, text, color, Icons, icon, expandableIcon) {
    return <TouchableOpacity
      onPress={callBack}
      style={styles.setting_item_container}
      >
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        {Icons && icon ?
          <Icons
            name={icon}
            size={16}
            style={{color:color, marginRight: 10}}
          /> : <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}/>
         }
         <Text>{text}</Text>
      </View>
      <Ionicons
        name={expandableIcon ? expandableIcon: 'ios-arrow-forward'}
        size={16}
        style={{
          marginRight: 10,
          alignSelf: 'center',
          color: color || 'black'
        }}/>
    </TouchableOpacity>
  }

  static getMenuItem(callBack, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIcon)
  }



  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, leftPadding: 12}}
      onPress={callBack}
      >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: 'white'}}
        />
    </TouchableOpacity>
  }

  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
      >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{opacity: 0.9, marginRight: 10, color: 'white'}}
        />
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

})
