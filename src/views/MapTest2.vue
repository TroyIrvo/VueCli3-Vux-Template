<template>
  <div class="maptest2">
    <el-amap
      ref="maptest2"
      :amap-manager="amapManager"
      :center="center"
      :zoom="zoom"
      :plugin="plugin"
      :events="events"
      class="amap-demo"
    >
    </el-amap>

    <div class="toolbar">
      <button @click="getMap()">get map</button>
    </div>
  </div>
</template>
<script>
import amap from '../common/js/Amap.js'
export default {
  name: 'maptest2',
  data() {
    return {
      amapManager: '',
      zoom: 12,
      center: [121.59996, 31.197646],
      events: {
        init: o => {
          console.log(o.getCenter())
          this.amapManager.setMap(this.$refs.maptest2.$$getInstance())
          console.log(this.$refs.maptest2.$$getInstance())
          o.getCity(result => {
            console.log(result)
          })
        },
        moveend: () => {},
        zoomchange: () => {},
        click: e => {
          alert('map clicked')
        }
      },
      plugin: [
        'ToolBar',
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(o) {
              console.log(o)
            }
          }
        }
      ]
    }
  },
  mounted() {},
  methods: {
    getMap() {
      // amap vue component
      console.log(this.amapManager._componentMap)
      // gaode map instance
      console.log(this.amapManager._map)
    }
  },
  created() {
    let that = this
    amap.initContext(this)
    amap.MapLoader().then(
      AMap => {
        console.log('地图加载成功')
        console.log(AMap)
        that.amapManager = new AMap.AMapManager()
      },
      e => {
        console.log('地图加载失败', e)
      }
    )
  }
}
</script>
<style>
.maptest2 {
  height: 500px;
}
</style>
