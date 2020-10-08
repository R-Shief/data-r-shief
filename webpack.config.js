const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    dashboard: './src/dashboard/dashboardClient.js',
    bibViz: './src/bibViz/bibVizClient.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/javascripts'),
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use:{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"]
          }
        }
      }
    ],
  }
};
