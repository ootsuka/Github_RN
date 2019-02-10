import LanguageDao from '../../expand/dao/LanguageDao'
import Types from '../types'

export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch()
      console.log('dispatching LANGUAGE_LOAD_SUCCESS')
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages: languages,
        flag: flagKey
      })
    } catch (e) {
      console.log(e)
    }
  }
}
