import LanguageDao from '../../expand/dao/LanguageDao'
import Types from '../types'

export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch()
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
