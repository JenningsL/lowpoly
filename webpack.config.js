var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry:[
 	// 'webpack-dev-server/client?http://127.0.0.1:3000', // WebpackDevServer host and port
  //   'webpack/hot/only-dev-server',
    './js/main'
  ],
  output: {
    path: __dirname + '/js/',
    publicPath: "/js/",
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot','jsx?harmony'],include: path.join(__dirname, 'js') },
      // { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
    ]
  },
};