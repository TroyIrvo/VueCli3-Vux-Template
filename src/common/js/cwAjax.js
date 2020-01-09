/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable standard/no-callback-literal */
import { common } from './common'
import { GzConfig } from './GzConfig'
import store from './../../store'
import router from './../../router'
import { bridge } from './dsbridge'
var cwAjax = {}
cwAjax.overTimes = 1000 * 60 * 120 // 超时时间 120分钟 即2小时
//  cwAjax.overTimes = 1000 * 10 // 超时时间

if (sessionStorage.getItem('user')) {
  cwAjax.GetTokenTime = JSON.parse(sessionStorage.getItem('user')).tokenTime
  cwAjax.token = JSON.parse(sessionStorage.getItem('user')).token
} else {
  cwAjax.GetTokenTime = ''
  cwAjax.token = ''
}

if (GzConfig.IsNative) {
  // 有些浏览器可能不支持或者支持不友好sessionStorage，因此存到localStorage
  if (localStorage.getItem('user')) {
    cwAjax.GetTokenTime = JSON.parse(localStorage.getItem('user')).tokenTime
    cwAjax.token = JSON.parse(localStorage.getItem('user')).token
  } else {
    cwAjax.GetTokenTime = ''
    cwAjax.token = ''
  }
}
// 返回构造后的AJAX请求参数
cwAjax.AjaxData = function(request, body, ajax) {
  if (!request && $.trim(request.servicecode) === '') {
    throw cwAjax.ErrorMessage.ERROR0003
  }

  if ($.type(request) === 'string') {
    request = {
      servicecode: request
    }
  }

  if ($.type(ajax) === 'function') {
    var callback = ajax
    ajax = {
      success: function(d) {
        if ($.type(d) === 'string') {
          d = cwAjax.StrToJson(d)
        }
        callback(d)
      }
    }
  }

  var publicrequest = $.extend(
    {
      sysid: GzConfig.system.sysid,
      reqid: cwAjax.NewGuid(),
      protover: '1.0',
      servicever: '1.0',
      requesttime: cwAjax.DateFormat(new Date(), 'yyyyMMddHHmmssfff'),
      signdata: '',
      reserve: ''
    },
    request
  )

  var data = {
    publicrequest: publicrequest,
    body: body
  }
  var ajaxObj = $.extend(
    {
      crossDomain: true,
      url:
        request.servicecode === '00000010022'
          ? 'http:// 58.62.172.116:7007/api/ServiceGateway/DataService'
          : GzConfig.system.url,
      type: 'post',
      cache: false,
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      headers: {
        token: cwAjax.token,
        'Source-Type': '76d5f6283a57b2db',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With'
      },
      error: function(request, status, error) {
        var errorObj = {
          XMLHttpRequest: request,
          textStatus: status,
          errorThrown: error
        }
        // var bv = GetBrowserVersion()
        if (
          request.readyState === 0 &&
          request.statusText.indexOf('拒绝访问') >= 0
        ) {
          alert(cwAjax.ErrorMessage.ERROR0004)
          return
        }
        // TODO:ajax在完成之前请求已经被取消（ajax请求没有发出），会进入这里
        if (request.readyState === 0 && request.statusText === 'error') return
        alert(cwAjax.ErrorMessage.ERROR0002)
      },
      beforeSend: function() {},
      complete: function() {}
    },
    ajax,
    {
      data: data
    }
  )
  //       console.log('woshiqingqiubaowen')
  //    console.log(JSON.stringify(ajaxObj))
  bridge.call('getRequest', ajaxObj)
  return ajaxObj
}

// 对AJAX进行封装
cwAjax.Ajax = function(request, body, ajax, login, useLocal) {
  //  console.log('请求开始:login->', login)
  //  console.log('请求开始:useLocal->', useLocal)
  //  console.log('请求开始:now->', new Date().getTime())
  //  console.log('请求开始:GetTokenTime->', cwAjax.GetTokenTime)
  //  console.log('请求开始:overTimes->', cwAjax.overTimes)
  //  console.log(
  //    '请求开始:now-GetTokenTime = ',
  //    new Date().getTime() - cwAjax.GetTokenTime
  //  )

  // 是否需要登录
  // 过滤登录接口、获取token接口
  if (typeof login === 'undefined') login = true
  if (login && new Date().getTime() - cwAjax.GetTokenTime > cwAjax.overTimes) {
    if (GzConfig.IsNative) {
      router.push({ name: 'Login' })
    } else {
      cwAjax.GetToken(function(data) {
        cwAjax.token = data
        cwAjax.GetTokenTime = new Date().getTime()
        startRequest()
      })
    }
  } else {
    startRequest()
  }

  function startRequest() {
    $.support.cors = true
    // 判断是否从本地请求还是直接ajax请求
    if (useLocal) {
      bridge.call('localrequest', '', function(data) {
        cwAjax.token = data
        ajax(data)
      })
    } else {
      var ajaxObj = cwAjax.AjaxData(request, body, ajax)
      ajaxObj.data = {
        '': cwAjax.Encode(cwAjax.JsonToStr(ajaxObj.data))
      }
      $.ajax(ajaxObj)
    }
  }
}

cwAjax.getWxUserInfo = function(code, callback) {
  $.ajax({
    async: false,
    type: 'GET',
    url: GzConfig.WX_ROOT + '/api/WeiXin/Index/AuthUser?code=' + code,
    success: function(json) {
      if (json) {
        try {
          // 保证写入的wxUserInfo是正确的
          var data = JSON.parse(json)
          //   alert(data.toString())
          if (data.openid) {
            sessionStorage.setItem('wxUserInfo', json) // 写缓存--微信用户信息
            getRealToken(data, callback)
          }
        } catch (e) {
          // alert(e.toString())
          //  TODO: handle exception
        }
      }
    }
  })
}

// 获取token
cwAjax.GetToken = function(callback) {
  // localStorage.clear()
  if (GzConfig.WXEnable) {
    const wxUserInfo = JSON.parse(sessionStorage.getItem('wxUserInfo'))
    if (!wxUserInfo) {
      const code = common.getUrlParameter('code')
      if (code) {
        cwAjax.getWxUserInfo(code, callback)
      } else {
        var redirect_uri = encodeURIComponent(window.location.href) // window.location.href /troy.ngrok.xiaomiqiu.cn
        var appid = encodeURIComponent(GzConfig.WX_APPID)
        if (
          window.location.href.indexOf('DaoLuYunShuAnQuanFengKongPC') != -1 ||
          window.location.href.indexOf('LianWangLianKongPC') != -1
        ) {
          getRealToken('', callback)
        } else {
          // 没有微信用户信息，没有授权-->> 需要授权，跳转授权页面
          window.location.href =
            'https:// open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            appid +
            '&redirect_uri=' +
            redirect_uri +
            '&connect_redirect=1&response_type=code&scope=snsapi_userinfo#wechat_redirect'
        }
      }
    } else {
      getRealToken(wxUserInfo, callback)
    }
  } else {
    // 跳过微信直接调用后台，用于测试
    const openid =
      //  {
      //    'subscribe': 1,
      //    'openid': 'o5gpj0cY03yQM2pdZcW8lnCy7H_Q',
      //    'nickname': '豪',
      //    'sex': 1,
      //    'language': 'zh_CN',
      //    'city': '广州',
      //    'province': '广东',
      //    'country': '中国',
      //    'headimgurl': 'http:// thirdwx.qlogo.cn/mmopen/bj9JGugn6UcqFh4YjoPJ3pSmrWFlZ9IHGJctQQ4vmK1fMp5ia1L6PLiaclnkAn6pLj9hYh3DmwjPic77DnVMDOg36jnmnS3pswf/132',
      //    'subscribe_time': 1545882195,
      //    'unionid': 'ofXai51Pt9ITvSfSyXgbddjoTj2k',
      //    'remark': '',
      //    'groupid': 0,
      //    'tagid_list': [],
      //    'subscribe_scene': 'ADD_SCENE_SEARCH',
      //    'qr_scene': 0,
      //    'qr_scene_str': ''
      //  }
      {
        subscribe: 1,
        openid: 'o5gpj0dAvSNYL9LOqaDSwzGWZJ00',
        nickname: '葉、⑩②',
        sex: 1,
        language: 'zh_CN',
        city: '广州',
        province: '广东',
        country: '中国',
        headimgurl:
          'http:// thirdwx.qlogo.cn/mmopen/PiajxSqBRaEKWic3frh8K5fbbhXvTicwbVO8oOnQWmIgwofjuLLnj25nTXxhW54pexN09V3oHUMY33SgyicDStbLqQ/132',
        subscribe_time: 1543572065,
        unionid: 'ofXai56Vw2PsyGr2LeNMWTBtBIS0',
        remark: '',
        groupid: 0,
        tagid_list: [],
        subscribe_scene: 'ADD_SCENE_SEARCH',
        qr_scene: 0,
        qr_scene_str: ''
      }
    sessionStorage.setItem('wxUserInfo', JSON.stringify(openid))
    getRealToken(openid, callback)
  }
}

function getRealToken(wxUserInfo, callback) {
  let params = {
    LingPai: wxUserInfo.unionid + wxUserInfo.openid,
    SysId: GzConfig.system.sysid,
    TargetSysId: GzConfig.system.TargetSysId
  }
  cwAjax.Ajax(
    '00000030040',
    params,
    function(result) {
      if (result.publicresponse.statuscode === 0) {
        const tokenInfo = {
          token: result.body,
          tokenTime: new Date().getTime()
        }
        cwAjax.GetTokenTime = tokenInfo.tokenTime
        cwAjax.token = result.body
        store.dispatch('USER_SIGNIN', tokenInfo)
        callback(cwAjax.token)
      } else if (result.publicresponse.statuscode === 2) {
        callback(false)
      }
    },
    false,
    false
  )
}

// 用户信息
cwAjax.UserInfo = function(fn) {
  var key = 'UserInfo'
  console.log(cwAjax.token)
  var data = cwAjax.Storage.get(key)
  if (data) {
    fn(cwAjax.StrToJson(data))
  } else {
    cwAjax.Ajax(
      '00000030002',
      cwAjax.token,
      function(d) {
        if (d.publicresponse.statuscode === 0) {
          cwAjax.Storage.set(key, cwAjax.JsonToStr(d))
          fn(d)
        } else {
          fn(false)
        }
      },
      true,
      false
    )
  }
}

cwAjax.GetUserInfo = function() {
  var key = 'UserInfo'
  var userInfoResponseStr = cwAjax.Storage.get(key)
  var userInfo = {}
  if (userInfoResponseStr) {
    var userInfoResponse = cwAjax.StrToJson(userInfoResponseStr)
    userInfo = userInfoResponse.body
  }
  return userInfo
}

// 临时存储数据
cwAjax.Storage = (function() {
  var t = sessionStorage
  var storage = {
    get: function(key) {
      return t.getItem(key)
    },
    set: function(key, value) {
      t.setItem(key, value)
    },
    remove: function(key) {
      t.removeItem(key)
    },
    clear: function() {
      t.removeItem()
    }
  }
  return storage
})()

// 编码
cwAjax.Encode = function(str) {
  return str
}

// 解码
cwAjax.Decode = function(str) {
  return str
}

// 将JSON序列化成字符串
cwAjax.JsonToStr = function(json) {
  return JSON.stringify(json)
}

// 将字符串反序列化成JSON
cwAjax.StrToJson = function(str) {
  return JSON.parse(str)
}

// 产生一个GUID
cwAjax.NewGuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    match
  ) {
    var randomNibble = (Math.random() * 16) | 0
    var nibble = match === 'y' ? (randomNibble & 0x3) | 0x8 : randomNibble
    return nibble.toString(16).toUpperCase()
  })
}

// 格式化时间
cwAjax.DateFormat = function(date, fmt) {
  var u = navigator.userAgent
  var isIOS = !!u.match(/\(i[^]+( U)? CPU.+Mac OS X/)
  if (isIOS === true) {
    var reg = new RegExp('-', 'g')
    fmt = fmt.replace(reg, '/')
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  var milliseconds = date.getMilliseconds()
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(f+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      RegExp.$1.length === 1
        ? milliseconds + ''
        : ('000' + milliseconds).substr(('' + milliseconds).length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }

  return fmt
}

/*
 * 时间格式化 兼容 ios 系统
 * @param  {String} dateObj 时间格式的字符串 不要直接传Date对象，可能会出错
 * @param  {String} fmt 格式化字符串
 */
cwAjax.DateFormat2 = function(dateObj, fmt) {
  let date
  if (typeof dateObj === 'string') {
    date = strToDate(dateObj)
  } else {
    console.error('传入的时间字符串不正确')
    return ''
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  var week = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear().toString() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') +
        week[date.getDay().toString() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k].toString()
          : ('00' + o[k].toString()).substr(('' + o[k].toString()).length)
      )
    }
  }
  return fmt
}
/**
 * 字符串转换为时间
 * @param  {String} src 字符串
 */
function strToDate(dateObj) {
  dateObj = dateObj
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
    .replace(/(-)/g, '/')
  if (dateObj.indexOf('.') > 0) dateObj = dateObj.slice(0, dateObj.indexOf('.'))
  return new Date(dateObj)
}

// 错误提示
cwAjax.ErrorMessage = {
  ERROR0001: '请重新进行登录',
  ERROR0002: '出现网络错误，请稍后再试',
  ERROR0003: '必须填写服务代码',
  ERROR0004:
    '初次使用系统，请点击IE浏览器的的“工具->Internet 选项->安全->自定义级别”将“其他”选项中的“通过域访问数据源”选中为“启用”'
}

cwAjax.getOrganizationInfo = function(orgdata, organizationName) {
  var organizationinfo = {}
  if (organizationName !== '') {
    var org = getChildOrgByName(orgdata, organizationName)
    if (org) {
      organizationinfo.code = $.trim(org.attributes.code)
      organizationinfo.type = $.trim(org.attributes.orgType)
    }
  }
  return organizationinfo
}

// 根据名字选择组织信息
var getChildOrgByName = function(org, name) {
  if (!!org && $.trim(name) !== '') {
    var length = org.length
    for (var i = 0; i < length; i++) {
      var temp = org[i]
      if (temp.text === name) {
        return temp
      }
      if (!!temp.children && temp.children.length > 0) {
        var code = getChildOrgByName(temp.children, name)
        if (code) {
          return code
        }
      }
    }
  }
  return ''
}

export { cwAjax }
