/*
 *全局导航跳转工具类
 */
 export default class NavigationUtil {
   /*
   去指定页面
   @params params
   @params page
   */
   static goPage(params, page) {
     const navigation = NavigationUtil.navigation
     if (!navigation) {
       console.log('navigation cannot be null')
       return
     }
     navigation.navigate(
       page,
       {
         ...params
       }
     )
   }
   /*
   返回上一页
   @params navigation
   */
   static goBack(navigation) {
     navigation.goBack()
   }
   /*
   重置到首页
   @params
   */
   static resetToHomePage(params) {
     const {navigation} = params
     navigation.navigate('Main')
   }
 }
