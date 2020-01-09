/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 自适应布局
import 'lib-flexible/flexible.js'
// vux 全局组件
import {
  LoadingPlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  WechatPlugin
} from 'vux'
// 引入jquery
import $ from 'jquery'
// 高德地图组件
import VueAMap from 'vue-amap'
// 引入请求
import { cwAjax } from './common/js/cwAjax'
import { GzConfig } from './common/js/GzConfig'
Vue.prototype.$VueAMap = VueAMap
Vue.prototype.$cwAjax = cwAjax
Vue.prototype.$GzConfig = GzConfig

Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(VueAMap)

Vue.use(require('vue-wechat-title'))

// 注册一个全局自定义指令 `v-drag`

Vue.directive('drag', {
  // 当被绑定的元素插入到 DOM 中时……
  bind: function(el) {
    // 聚焦元素
    let odiv = el // 获取当前元素

    odiv.ontouchstart = e => {
      // 算出鼠标相对元素的位置
      let disX = e.touches[0].clientX - odiv.offsetLeft
      let disY
      if (odiv.classList[1] == 'one') {
        disY = e.touches[0].clientY - odiv.offsetTop + 10
      } else if (odiv.classList[1] == 'two') {
        disY = e.touches[0].clientY - odiv.offsetTop
      } else {
        disY = e.touches[0].clientY - odiv.offsetTop + 50
      }
      odiv.ontouchmove = e => {
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.touches[0].clientX - disX
        let top = e.touches[0].clientY - disY

        // 绑定元素位置到positionX和positionY上面
        e.positionX = top
        e.positionY = left
        odiv.style.position = 'relative'
        // 移动当前元素
        if (left <= 0) left = 0
        if (left >= document.documentElement.clientWidth - odiv.offsetWidth) {
          left = document.documentElement.clientWidth - odiv.offsetWidth
        }
        if (odiv.classList[1] == 'one') {
          if (top <= 0) top = 0
          if (
            top >=
            document.documentElement.clientHeight - odiv.offsetHeight
          ) {
            top = document.documentElement.clientHeight - odiv.offsetHeight
          }
        } else if (odiv.classList[1] == 'two') {
          if (top <= 60) {
            top = 60
            $('.hideCarDetail').hide()
          }
          if (top > 60) {
            $('.hideCarDetail').show()
          }
          if (
            top >=
            document.documentElement.clientHeight - odiv.offsetHeight
          ) {
            $('.showcarecarnumber').css('bottom', '230px')
            $('.map_control_btn').css('bottom', '250px')
          }
          if (
            top >=
            document.documentElement.clientHeight - odiv.offsetHeight + 230 - 47
          ) {
            top =
              document.documentElement.clientHeight -
              odiv.offsetHeight +
              230 -
              47
            $('.showcarecarnumber').css('bottom', '47px')
            $('.map_control_btn').css('bottom', '67px')
          }
        } else {
          if (top <= -46) top = -46
          if (
            top >=
            document.documentElement.clientHeight - odiv.offsetHeight - 46
          ) {
            top = document.documentElement.clientHeight - odiv.offsetHeight - 46
          }
        }

        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'

        if (odiv.classList[1] == 'two') {
          odiv.children[0].style.height =
            odiv.getBoundingClientRect().height +
            odiv.getBoundingClientRect().bottom +
            odiv.getBoundingClientRect().top +
            230 +
            'px'
          odiv.children[0].children[0].style.height =
            odiv.children[0].style.height
        }
        if (e.type == 'touchmove') {
          e.preventDefault()
        }
      }

      odiv.ontouchend = e => {
        if (odiv.classList[1] == 'two') {
          let top = e.touches[0].clientY - disY
          let disY = e.touches[0].clientY - odiv.offsetTop
          if (top == 60) {
            odiv.children[0].style.maxheight =
              odiv.getBoundingClientRect().height +
              odiv.getBoundingClientRect().bottom +
              odiv.getBoundingClientRect().top +
              230 +
              'px'
          }
        }
        odiv.touchmove = null
        odiv.touchend = null
      }
    }
  }
})

// 路由判断进入页面是否需要登录
let lastRouter = ''
router.beforeEach(({ meta, path }, from, next) => {
  const { auth = false } = meta
  const tokeninfo = JSON.parse(sessionStorage.getItem('user'))

  if (
    tokeninfo === null ||
    tokeninfo.token === '' ||
    new Date().getTime() - cwAjax.GetTokenTime > cwAjax.overTimes
  ) {
    if (GzConfig.IsNative) {
      console.log(tokeninfo)
      if (from.path == '/My' && !auth) {
        if (lastRouter == '/My/Login') {
          return next()
        }
        next({
          path: lastRouter
        })
      }
      next()
    } else {
      cwAjax.GetToken(function(isBindAccount) {
        const isLogin = Boolean(isBindAccount) // true用户已登录， false用户未登录
        if (path != '/My' && !isLogin) {
          lastRouter = path
        }
        if (auth && !isLogin && path !== '/My') {
          return next({
            path: '/My'
          })
        } else if (from.path == '/My' && isLogin && !auth) {
          return next({
            path: lastRouter
          })
        }
        next()
      })
    }
  } else {
    if (from.path == '/My' && !auth) {
      if (lastRouter == '/My/Login') {
        return next()
      }
      next({
        path: lastRouter
      })
    }
    next()
  }
})
router.onError(err => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = err.message.match(pattern)
  if (isChunkLoadFailed) {
    let chunkBool = sessionStorage.getItem('chunkError')
    let nowTimes = Date.now()
    if (
      chunkBool === null ||
      (chunkBool && nowTimes - parseInt(chunkBool) > 60000)
    ) {
      // 路由跳转报错,href手动跳转
      sessionStorage.setItem('chunkError', 'reload')
      const targetPath = router.history.pending.fullPath
      window.location.href = window.location.origin + targetPath
    } else if (chunkBool === 'reload') {
      // 手动跳转后依然报错,强制刷新
      sessionStorage.setItem('chunkError', Date.now())
      window.location.reload(true)
    }
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
