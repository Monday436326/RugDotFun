const path = require('path');
module.exports = {
      // other configurations...
  module: {
    rules: [
      // other rules...
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules\/@cosmjs/,
      },
    ],
  },
  resolve: {
    fallback: {
      "vm": require.resolve("vm-browserify"),
    },
  },
  ignoreWarnings: [
    (warning) =>
      warning.message.includes('Failed to parse source map from') &&
      warning.message.includes('node_modules/@cosmjs'),
  ],
    devtool: false,
  };
  