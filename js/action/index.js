
import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme/index'
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular/index'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending/index'
import { onLoadFavoriteData } from './favorite/index'
import { onLoadLanguage } from './language/index'

export default actions = {
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage,
}
