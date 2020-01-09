export const USER_SIGNIN = 'USER_SIGNIN' // 登录成功
export const USER_SIGNOUT = 'USER_SIGNOUT' // 退出登录

export default {
  state: JSON.parse(sessionStorage.getItem('user')) || {},
  mutations: {
    [USER_SIGNIN](state, user) {
      Object.assign(state, user)
      sessionStorage.setItem('user', JSON.stringify(state))
    },
    [USER_SIGNOUT](state) {
      // sessionStorage.removeItem('user')
      // Object.keys(state).forEach(k => Vue.delete(state, k))
      Object.keys(state).forEach(function(k) {
        if (k !== 'AccountName') {
          // Vue.delete(state, k)
          state[k] = ''
        }
      })
      // 保留用户名
      sessionStorage.setItem('user', JSON.stringify(state))
    }
  },
  actions: {
    [USER_SIGNIN]({ commit }, user) {
      commit(USER_SIGNIN, user)
    },
    [USER_SIGNOUT]({ commit }) {
      commit(USER_SIGNOUT)
    }
  }
}
