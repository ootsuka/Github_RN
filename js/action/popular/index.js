import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

export function onLoadPopularData(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: Types.POPULAR_REFRESH,
      storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url) // async action and data flow
        .then(data => {
          handleData(dispatch, storeName, data, pageSize)
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

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
  return dispatch => {
    setTimeOut(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//already load all data
        if (tyoeOf(callBack) === 'function') {
          callBack('no more')
        }
        dispatch({
          types: Types.LOAD_POPULAR_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        dispatch({
          types: Types.LOAD_POPULAR_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0, max)
        })
      }
    }, 1000)
  }
}

const handleData = (dispatch, storeName, data, pageSize) => {
  let fixItems = []
  if (data && data.data && data.data.items) {
    fixItems = data.data.items
  }
  dispatch({
    type: Types.LOAD_POPULAR_SUCCESS,
    projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
    storeName,
    pageIndex : 1
  })
}
