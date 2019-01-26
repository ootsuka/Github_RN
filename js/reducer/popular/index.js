import Types from '../../action/types'

const defaultState = {}

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.item,
          isLoading: false
        }
      }
    case Types.POPULAR_REFRESH:
       return {
         ...state,
         [action.storeName]: {
           ...state[action.storeName],
           isLoading: true
         }
       }
    case Types.LOAD_POPULAR_FAIL:
       return {
         ...state,
         [action.storeName]: {
           ...state[action.storeName],
           isLoading: false
         }
       }
    default:
    return state
  }
}
