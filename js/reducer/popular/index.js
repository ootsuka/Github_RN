import Types from '../../action/types'

const defaultState = {}

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items, // original data
          projectModes: action.projectModes, //data to show this round
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }
    case Types.POPULAR_REFRESH:
       return {
         ...state,
         [action.storeName]: {
           ...state[action.storeName],
           isLoading: true,
           hideLoadingMore: true
         }
       }
    case Types.POPULAR_REFRESH_FAIL:
       return {
         ...state,
         [action.storeName]: {
           ...state[action.storeName],
           isLoading: false
         }
       }
    case Types.LOAD_POPULAR_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModes: action.projectModes,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }
    case Types.LOAD_POPULAR_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex
        }
      }
    default:
    return state
  }
}
