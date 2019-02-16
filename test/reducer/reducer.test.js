import {onLoadFavoriteData} from '../../js/action/favorite/index'
import onAction, {defaultState} from '../../js/reducer/favorite/index'
import Types from '../../js/action/types'

it('test reducer',() => {
  const nextState = onAction(defaultState, {
    type: Types.FAVORITE_LOAD_DATA,
    storeName: 'keys'
  })
  expect(nextState).toMatchSnapshot()
})
