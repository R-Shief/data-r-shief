const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    archive: './src/javascripts/archiveClient.js',
    blog: './src/javascripts/blogClient.js',
    userpacking: './src/javascripts/userPackingClient.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/javascripts'),
  },
};
