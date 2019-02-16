import Types from '../../action/types'

/*
   favorite: {
      popular: {
         projectModels: [],
         isLoading: false
      },
      trending: {
         projectModels: [],
         isLoading: false
      }
   }
*/
export const defaultState = {}

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.FAVORITE_LOAD_DATA:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        }
      }
    case Types.FAVORITE_LOAD_SUCCESS:
       return {
         ...state,
         [action.storeName]: {
           ...state[action.storeName],
           isLoading: false,
           projectModels: action.projectModels
         }
       }
    case Types.FAVORITE_LOAD_FAIL:
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
