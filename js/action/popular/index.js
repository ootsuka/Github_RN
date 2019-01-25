import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

export function onLoadPopularData(storeName, url) {
  return dispatch => {
    dispatch({
      type: Types.POPULAR_REFRESH,
      storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url) // async action and data flow
        .then(data => {
          handleData(dispatch, storeName, data)
        })
        .catch(error => {
          console.log(error)
          dispatch({
            type: Types.LOAD_POPULAR_FAIL,
            storeName,
            error
          })
        })
  }
}

const handleData = (dispatch, storeName, data) => {
  dispatch({
    type: Types.LOAD_POPULAR_SUCCESS,
    item: data && data.data && data.data.items,
    storeName
  })
}
