<template>
  <div class="index" style="width: 100%;">
    <group-title>服务中心</group-title>
    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item
        link="https://c.eqxiu.com/s/9VBwGged"
        class="abcd"
        maidian="456"
      >
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">产品介绍</span>
      </grid-item>
      <grid-item link="/ServiceCenter/SmartService" class="abcd" maidian="456">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">数据服务</span>
      </grid-item>
      <grid-item
        link="/ServiceCenter/QuestionConsultList"
        class="abcd"
        maidian="456"
      >
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">反馈咨询进度查询</span>
      </grid-item>
      <grid-item
        link="/ServiceCenter/OnlineServiceConsulting?serverType=投诉&businessType=卫星定位"
        class="abcd"
        maidian="456"
      >
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">反馈咨询</span>
      </grid-item>
    </grid>

    <group-title>安全监控</group-title>

    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item link="/SafeMonitor/CarPosition">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">车辆定位</span>
      </grid-item>
      <grid-item link="/SafeMonitor/TrackSearch">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">轨迹回放</span>
      </grid-item>
      <grid-item link="/SafeMonitor/VideoSearch">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">视频监控</span>
      </grid-item>
    </grid>

    <group-title>企业注册认证</group-title>

    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item link="/ServiceCenter/UserRegisterApply">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">用户注册申请</span>
      </grid-item>
      <grid-item link="/My/CertificationQuick">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">企业快速认证</span>
      </grid-item>
      <!-- <grid-item link="/SafeMonitor/VideoSearch">
        <img
          slot="icon"
          src="../assets/logo.png"
        >
        <span slot="label">视频监控</span>
      </grid-item> -->
    </grid>

    <group-title>购物车</group-title>
    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item link="/order/OrderConfirm">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">订单确认</span>
      </grid-item>
      <grid-item link="/order/OrderInfomation">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">已支付-订单信息</span>
      </grid-item>
      <grid-item link="/order/MyOrder">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">我的订单</span>
      </grid-item>
    </grid>

    <group-title>我的</group-title>
    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item link="/My">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">我的</span>
      </grid-item>
    </grid>

    <!-- <group-title>多通道切换测试</group-title>
    <grid
      :show-lr-borders="false"
      :show-vertical-dividers="true"
    >
      <grid-item link="/ChangVideoChm">
        <img
          slot="icon"
          src="../assets/logo.png"
        >
        <span slot="label">多通道切换测试</span>
      </grid-item>
    </grid> -->

    <group-title>注册</group-title>
    <grid :show-lr-borders="false" :show-vertical-dividers="true">
      <grid-item link="/My/RegisterAccount">
        <img slot="icon" src="../assets/logo.png" />
        <span slot="label">注册</span>
      </grid-item>
    </grid>
  </div>
</template>

<script>
// Tabbar, TabbarItem,Group
import { Grid, GridItem, GroupTitle } from 'vux'
export default {
  name: 'index',
  data() {
    return {
      title: '',
      transitionName: 'slide-left',
      tabbarIsShow: true
    }
  },
  // Tabbar,TabbarItem, Group
  components: {
    Grid,
    GridItem,
    GroupTitle
  },
  mounted: function() {
    console.log('xxxxx')
  },
  watch: {
    /* $route(to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      console.log(toDepth)
      console.log(fromDepth)
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    } */
  },
  methods: {
    /* changeTabbar: function(index) {
      if (index != 0) {
        $('.mescroll-totop')
          .removeClass('mescroll-fade-in')
          .addClass('mescroll-fade-out')
      }
      this.$nextTick(function() {
        changeTabbarEvent(index)
      })
    } */
  },
  activated: function() {
    // changeTabbarEvent(0)
    console.log('hhh')
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  beforeRouteEnter(to, from, next) {
    next()
  }
}

/* function changeTabbarEvent(index) {
   $('.weui-tabbar__item').eq(index).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
} */
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.child-view {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}

.grid-center {
  display: block;
  text-align: center;
  color: #666;
}

.weui-grids {
  background-color: #fff;
}
</style>
