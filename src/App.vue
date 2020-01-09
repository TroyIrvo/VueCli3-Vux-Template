<template>
  <div id="app">
    <keep-alive>
      <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive" />
    </keep-alive>

    <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: 'Microsoft YaHei', 'Arial', 'Helvetica', 'sans-serif', '宋体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
