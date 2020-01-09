import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited./* webpackChunkName: "about" */
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),
    meta: {
      // keepAlive: true,
      title: '紫光服务中心'
    }
  },
  {
    path: '/',
    name: 'maptest',
    component: () => import('../views/MapTest.vue'),
    meta: {
      // keepAlive: true,
      title: '地图测试'
    }
  },
  {
    path: '/maptest2',
    name: 'maptest2',
    component: () => import('../views/MapTest2.vue'),
    meta: {
      // keepAlive: true,
      title: '地图测试'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
