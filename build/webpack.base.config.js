var path = require('path');
var webpack = require('webpack');
module.exports = {
  // 入口
  entry: {
    main: './src/main',
    vendors: ['vue', 'vue-router']
  },
  // 输出
  output: {
    path: path.join(__dirname, '../dist'),
  },
  // 加载器
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
    ],
    // 不解析ol.js这个压缩文件
    //noParse: [path.join(__dirname, "./node_modules/openlayers/dist/ol.js")],
    loaders: [
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.js$/, loader: 'babel!eslint', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style!css!autoprefixer'},
      {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
      {test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192'},
      {test: /\.(html|tpl)$/, loader: 'html-loader'}
    ]
  },
  // 转es5
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  resolve: {
    root: [],
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['', '.js', '.vue'],
    // 别名，可以直接使用别名来代表设定的路径以及其他
    alias: {
      filter: path.join(__dirname, './src/filters'),
      components: path.join(__dirname, './src/components'),
      openlayers: path.resolve(__dirname, '../node_modules/openlayers/dist/ol.js')
}
  },
  plugins: [
    // 将ol设为全局变量
    new webpack.ProvidePlugin({
      ol: 'openlayers'
    })
  ],
  eslint: {
    configFile: './.eslintrc'
  }
}
