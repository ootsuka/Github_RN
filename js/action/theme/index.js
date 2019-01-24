import Types from '../types'

export const onThemeChange = (theme) => {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}
