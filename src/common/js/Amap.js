let context = null // 定义一个变量，用来代替this（vue）
const initContext = _vue => {
  context = _vue
}
export default {
  initContext,
  MapLoader() {
    // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
      context.$VueAMap.initAMapApiLoader({
        key: context.$GzConfig.AMapKey,
        plugin: [
          'Geolocation',
          'AMap.Geocoder',
          'AMap.Autocomplete',
          'AMap.PlaceSearch',
          'AMap.Scale',
          'AMap.OverView',
          'AMap.ToolBar',
          'AMap.MapType',
          'AMap.PolyEditor',
          'AMap.CircleEditor',
          'AMap.GraspRoad',
          'AMap.Driving'
        ],
        // 默认高德 sdk 版本为 1.4.4
        v: '1.4.9'
        // uiVersion: '1.0.11' // 版本号
      })
      resolve(context.$VueAMap)
    })
  }
}
