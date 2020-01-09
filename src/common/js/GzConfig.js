// const env = require('./env')
const GzConfig = {}

// 是否app打包
GzConfig.IsNative = window.g.IsNative

// 公众号相关
GzConfig.WX_ROOT = window.g.WX_ROOT // 'http://121.10.143.207:7055'  //http://aqfkfw.agfw.cn 121.10.143.207:7055 http://10.0.66.102:7055
GzConfig.WX_APPID = window.g.WX_APPID // 'wxd2241420476d729f' // wx816baa924522994b wx9605c16e408f4d37 wxd2241420476d729f
// 开启微信认证
GzConfig.WXEnable = window.g.WXEnable // false true

GzConfig.IsTiYan = window.g.IsTiYan
// 推送服务器地址
GzConfig.signalrIP = window.g.SignalRIP //
// 开启埋点
GzConfig.UBLAEnable = false
// 开启菜单权限
GzConfig.permNable = false
// 高德地图key
GzConfig.AMapKey = '1e5e677c92f7468b78e822c27490105d' // 49bed1801cb55d48140458d8e9291554

GzConfig.mediaIp = localStorage.getItem('mediaIp') || '103.56.76.161' // 有为媒体服务器地址121.10.143.240  121.10.143.215  公有云:103.56.76.161
GzConfig.mediaPort = localStorage.getItem('mediaPort') || '7002' // 有为媒体服务器端口8600 7002 5000
GzConfig.mediaHlsPort = '6080' // 有为媒体服务器hls端口
GzConfig.userName = 'sa' // 有为媒体服务器用户登录名称
GzConfig.password = '123456' // 有为媒体服务器用户登录密码

// 系统相关
GzConfig.defaultIport = sessionStorage.getItem('ip') || window.g.defaultIport // "10.0.64.253:7007"; ///10.0.64.253:7007  10.0.64.249:7007 121.10.143.207:7007

GzConfig.system = {
  sysid: '638396FA-AEC9-45D1-A1F5-F83B7BAFA5D9',
  sysid_alarm: '60190FC4-5103-4C76-94E4-12A54B62C92A', // 报警查询系统id
  url: 'http://' + GzConfig.defaultIport + '/api/ServiceGateway/DataService',
  TargetSysId: '60190FC4-5103-4C76-94E4-12A54B62C92A'
}

export { GzConfig }
