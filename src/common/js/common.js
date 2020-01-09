var common = {}

common.autoBack = function() {
  setTimeout(function() {
    history.back()
  }, 1000)
}

common.showConfirmMessageCongYe = function(msg) {
  var cf =
    '<div class="js_dialog" id="androidDialog2" style="opacity: 1"><div class="weui-mask"></div> <div class="weui-dialog weui-skin_android"> <div class="weui-dialog__bd">' +
    msg +
    '</div> <div class="weui-dialog__ft"> <a href="javascript:"  onclick="cancelConfirm()" class="weui-dialog__btn weui-dialog__btn_default">否</a> <a href="javascript:" onclick="sureConfirm()" class="weui-dialog__btn weui-dialog__btn_primary">是</a></div></div></div>'
  // eslint-disable-next-line no-undef
  $('div')
    .first()
    .append(cf)
}

common.showConfirmMessage = function(msg) {
  var cf =
    '<div class="js_dialog" id="androidDialog2" style="opacity: 1"><div class="weui-mask"></div> <div class="weui-dialog weui-skin_android"> <div class="weui-dialog__bd">' +
    msg +
    '</div> <div class="weui-dialog__ft"> <a href="javascript:"  onclick="cancelConfirm()" class="weui-dialog__btn weui-dialog__btn_default">取消</a> <a href="javascript:" onclick="sureConfirm()" class="weui-dialog__btn weui-dialog__btn_primary">确认</a></div></div></div>'
  // eslint-disable-next-line no-undef
  $('div')
    .first()
    .append(cf)
}

common.showInputConfirmMessage = function(msg) {
  var cf =
    '<div class="js_dialog" id="iosDialog2" style="opacity: 1"> <div class="weui-mask"></div> <div class="weui-dialog"> <div class="weui-dialog__hd"><strong class="weui-dialog__title">' +
    msg +
    '</strong></div><div class="weui-dialog__bd"><input class="weui-input" id="inputText" type="text" placeholder="请输入从业资格证号"></div> <div class="weui-dialog__ft"> <a href="javascript:"  onclick="cancelConfirm()" class="weui-dialog__btn weui-dialog__btn_default">取消</a> <a href="javascript:" onclick="inputConfirm()" class="weui-dialog__btn weui-dialog__btn_primary">确认</a> </div> </div> </div>'
  // eslint-disable-next-line no-undef
  $('div')
    .first()
    .append(cf)
}

common.ajax = function(type, url, data, callback) {
  // eslint-disable-next-line no-undef
  $.ajax({
    type: type,
    url: url,
    data: data,
    dataType: 'json',
    timeout: 1000,
    // eslint-disable-next-line no-undef
    context: $('body'),
    processData: false,
    contentType: false,
    beforeSend: function() {
      //              toast.showLoading()
    },
    complete: function() {
      setTimeout(function() {
        //                  toast.dismissLoading()
      }, 1000)
    },
    success: function(data) {
      callback(data)
    },
    error: function(xhr) {
      console.log(xhr)
    }
  })
}

common.get = function(url, data, callback) {
  common.ajax('GET', url, data, callback)
}

common.post = function(url, data, callback) {
  common.ajax('POST', url, data, callback)
}

/**
 * 判断当前设备终端
 *
 */
common.UA = function() {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // 判断是否是 android终端
  let isIOS = !!u.match(/\(i[^]+( U)? CPU.+Mac OS X/) // 判断是否是 ios终端
  console.log('是否是Android：' + isAndroid) // true,false
  console.log('是否是iOS：' + isIOS)
  if (isAndroid === true) {
    return 'Android'
  } else if (isIOS === true) {
    return 'IOS'
  } else {
    return 'PC'
  }
}

/*
 * 获取当前时间
 * */
common.getCurrentDate = function() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + '-' + month + '-' + strDate
}

/*
 * 获取当前时分
 * */
common.getCurrentHours = function() {
  var date = new Date()
  var Hours = date.getHours()
  var Minutes = date.getMinutes()

  return Hours + ':' + Minutes
}

/**
 * 日期转换为星期
 * @param d
 * @returns {*}
 */

common.weekday = function(d) {
  var weekday = new Array(7)
  weekday[0] = '周日'
  weekday[1] = '周一'
  weekday[2] = '周二'
  weekday[3] = '周三'
  weekday[4] = '周四'
  weekday[5] = '周五'
  weekday[6] = '周六'

  return weekday[d.getDay()]
}

/**
 * 计算几个月之后的日期,即获取日历最大值
 * @param dtstr
 * @param n
 * @returns {string}
 */
common.addMonth = function(dtstr, n) {
  var s = dtstr.split('-')
  var yy = parseInt(s[0])
  var mm = parseInt(s[1]) - 1
  var dd = parseInt(s[2])
  var dt = new Date(yy, mm, dd)
  dt.setMonth(dt.getMonth() + n)
  var month = parseInt(dt.getMonth()) + 1
  return dt.getFullYear() + '-' + month + '-' + dd
}

// 比较时分之间相等
common.CompareHours = function(t1, t2) {
  var date = new Date()
  var a = t1.split(':')
  var b = t2.split(':')
  return date.setHours(a[0], a[1]) > date.setHours(b[0], b[1])
}

// 判断 年-月-日，大小
common.compareDate = function(DateOne, DateTwo) {
  var str = '-'
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf(str))
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf(str) + 1)
  var OneYear = DateOne.substring(0, DateOne.indexOf(str))

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf(str))
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf(str) + 1)
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf(str))
  // eslint-disable-next-line eqeqeq
  if (
    Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) ===
    Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)
  ) {
    return true
  } else {
    return false
  }
}

function setupWebViewJavascriptBridge(callback) {
  var bridge =
    window.WebViewJavascriptBridge || window.WKWebViewJavascriptBridge
  if (bridge) {
    return callback(bridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function() {
        callback(bridge)
      },
      false
    )
  }
  var callbacks = window.WVJBCallbacks || window.WKWVJBCallbacks
  if (callbacks) {
    return callbacks.push(callback)
  }
  window.WVJBCallbacks = window.WKWVJBCallbacks = [callback]
  if (window.WKWebViewJavascriptBridge) {
    window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
  } else {
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

setupWebViewJavascriptBridge(function(bridge) {
  /**
   * 接收android的参数信息。并返回android回调信息
   * @param id 与android约定的调用id
   * @returns {*}
   */
  // 注册回调函数，第一次连接时调用 初始化函数
  common.androidToJS = function(id, callback) {
    // 接收安卓发来的消息   并返回给安卓通知
    bridge.registerHandler(id, function(data) {
      console.log(id + '从原生传来的消息:', data)
      callback(data)
      /* var responseData = "我接受到了安卓的调用"
      responseCallback(responseData) */
    })
  }

  /**
   * 接收js传递的参数。并提供返回js的消息的回调
   * @param data 需要传递的参数对象
   * @param id  与android互相约定的调用id.
   */
  common.jsToAndroid = function(data, id, callback) {
    bridge.callHandler(id, data, function(responseData) {
      console.log('原生反馈的消息:', responseData)
      callback(responseData)
    })
  }
})

common.base64ToBlob = function(dataURI, filename) {
  var byteString = base64ToByteString(dataURI)
  var ab = new ArrayBuffer(byteString.length)
  var ia = new Uint8Array(ab)

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  var mimeType = getMimeTypeFromDataURI(dataURI)

  if (typeof filename === 'undefined') {
    filename =
      getDateString(new Date()) + '.' + getExtensionByMimeType(mimeType)
  }

  return blobToFile(createBlob(ab, mimeType), filename)
}

common.getUrlParameter = function(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = decodeURI(window.location.search.substr(1)).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

var base64ToByteString = function base64ToByteString(dataURI) {
  // get data part of string (remove data:image/jpeg...,)
  var dataPart = dataURI.split(',')[1]

  // remove any whitespace as that causes InvalidCharacterError in IE
  var dataPartCleaned = dataPart.replace(/\s/g, '')

  // to bytestring
  return atob(dataPartCleaned)
}

var getMimeTypeFromDataURI = function getMimeTypeFromDataURI(dataUri) {
  if (!dataUri) {
    return null
  }
  var matches = dataUri.substr(0, 16).match(/^.+/)
  try {
    if (matches.length) {
      return matches[0].substring(5, matches[0].length - 1)
    }
  } catch (exception) {}
  return null
}

var getDateString = function getDateString(date) {
  return (
    date.getFullYear() +
    '-' +
    leftPad(date.getMonth() + 1, '00') +
    '-' +
    leftPad(date.getDate(), '00') +
    '_' +
    leftPad(date.getHours(), '00') +
    '-' +
    leftPad(date.getMinutes(), '00') +
    '-' +
    leftPad(date.getSeconds(), '00')
  )
}

var leftPad = function leftPad(value) {
  var padding =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ''
  return (padding + value).slice(-padding.length)
}

var getExtensionByMimeType = function getExtensionByMimeType(mimetype) {
  var type = void 0
  // eslint-disable-next-line no-undef
  for (type in MimeTypes) {
    // eslint-disable-next-line no-undef
    if (!MimeTypes.hasOwnProperty(type)) {
      continue
    }
    // eslint-disable-next-line no-undef
    if (MimeTypes[type] === mimetype) {
      return type
    }
  }
  return mimetype
}

var blobToFile = function blobToFile(blob, name) {
  if ('lastModified' in File.prototype) {
    blob.lastModified = new Date()
  } else {
    blob.lastModifiedDate = new Date()
  }
  blob.name = name
  return blob
}

var createBlob = function createBlob(data, mimeType) {
  var BB = (window.BlobBuilder =
    window.BlobBuilder ||
    window.WebKitBlobBuilder ||
    window.MozBlobBuilder ||
    window.MSBlobBuilder)

  if (BB) {
    var bb = new BB()
    bb.append(data)
    return bb.getBlob(mimeType)
  }

  return new Blob([data], {
    type: mimeType
  })
}

export { common }
