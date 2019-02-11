import Types from '../../action/types'
import ThemeFactory, {ThemeFlags} from '../../res/styles/ThemeFactory'

const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default)
}

const onAction = (state = defaultState, action) => {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme
      }
      break;
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      }
    default:
      return state

  }
}
export default onAction
