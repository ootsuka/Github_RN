import Types from '../types'
import ThemeDao from '../../expand/dao/ThemeDao'

export const onThemeChange = (theme) => {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}

export const onThemeInit = () => {
  return dispatch => {
    new ThemeDao().getTheme().then((data) => {
      dispatch(onThemeChange(data))
    })
  }
}

export const onShowCustomThemeView = (show) => {
  return {
    type: Types.SHOW_THEME_VIEW,
    customThemeViewVisible: show
  }
}
