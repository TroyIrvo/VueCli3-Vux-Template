const map = require('./node_modules/vux/src/components/map.json')

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'vux',
      libraryDirectory: 'src/components',
      camel2UnderlineComponentName: false,
      camel2DashComponentName: false,
      customName: function (name) {
        if (!map[name]) {
          console.log(name);
        }
        return `vux/${map[name]}`;
      }
    }]
  ]
}
