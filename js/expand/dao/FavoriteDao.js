import {AsyncStorage} from 'react-native'

const FAVORITE_KEY_PREFIX = 'favorite_'
export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag
  }
  /*
  * favorite items, save favorite items
  * @param key item key
  * @param value
  * @param callBack
  */
  saveFavoriteItem(key, value, callBack) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true)
      }
    })
  }

  updateFavoriteKeys(key, isAdd) {
    debugger
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = []
        if (result) {
          favoriteKeys = JSON.parse(result)
        }
        let index = favoriteKeys.indexOf(key)
        if (isAdd) {
          if (index === -1) favoriteKeys.push(key)
        } else {
          if (index !== -1) favoriteKeys.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
      }
    })
  }

  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }

  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }

  getAllItems() {
    debugger
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = []
        if (keys) {
          AsyncStorage.multiGet(keys, (error, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0]
                let value = store[i][1]
                if (value) items.push(JSON.parse(value))
              })
              resolve(items)
            } catch (e) {
              reject(e)
            }
          })
        } else {
          resolve(items)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }
}
