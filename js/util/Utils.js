export default class Utils {
  static checkFavorite(item, keys = []) {
    if (!keys) return false
    for (let i = 0; i < keys.length; i++) {
      let id = item.id ? item.id : item.fullName
      if (id.toString() === keys[i]) {
        return true
      }
    }
    return false
  }
}
