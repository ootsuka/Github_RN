import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData, _projectModels, docallBack} from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ArrayUtil from '../../util/ArrayUtil'
import Utils from '../../util/Utils'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const CANCEL_TOKENS = []

export function onRefreshSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({
      type: Types.SEARCH_REFRESH
    })
    fetch(genFetchUrl(inputKey)).then(response => {
      return hasCancel(token) ? null : response.json()
    }).then(responseData => {
      if (hasCancel(token, true)) {
        console.log('user canceled search')
        return
      }
      if (!responseData || !responseData.items || responseData.items.length === 0) {
        dispatch({type: Types.SEARCH_FAIL, message: `did not find any project of ${inputKey}`})
        docallBack(callBack, `did not find any project of ${inputKey}`)
        return
      } else {
        let items = responseData.items
        handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', {data: items}, pageSize, favoriteDao, {
          showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
          inputKey
        })
      }
    }).catch(e => {
      console.log(e)
      dispatch({type: Type.SEARCH_FAIL, error: e})
    })
  }
}

export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({type: Types.SEARCH_CANCEL})
  }
}
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//already load all data
        if (typeof(callBack) === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex,
        })
      } else {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data
          })
        })

      }
    }, 1000)
  }
}

function genFetchUrl(inputKey) {
  return API_URL + inputKey + QUERY_STR
}

function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token)
    return true
  }
  return false
}
