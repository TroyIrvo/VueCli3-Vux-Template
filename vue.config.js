const webpack = require('webpack')

module.exports = {
  configureWebpack: config => {
    const plugins = []
    require('@vux/loader').merge(config, {
      plugins: [
        'vux-ui',
        {
          name: 'less-theme',
          path: 'src/theme.less'
        }
      ]
    })
    plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    )
    config.externals = {}

    config.plugins = [...config.plugins, ...plugins]
  }
}
