// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify'),
        buffer: require.resolve('buffer'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    );

    return config;
};
