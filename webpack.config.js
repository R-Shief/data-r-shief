const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    archive: './src/javascripts/archiveClient.js',
    blog: './src/javascripts/blogClient.js',
    dashboard: './src/javascripts/dashboard/dashboardClient.js',
    bibViz: './src/javascripts/bibViz/bibVizClient.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/javascripts'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use:{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  }
};
