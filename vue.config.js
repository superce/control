const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const isProduction = process.env.NODE_ENV === 'production' ;

module.exports = {
    publicPath: './',
    outputDir: '../autoplat',
    assetsDir: isProduction?'./static/':"./",
    productionSourceMap: false,
    lintOnSave: false,

    configureWebpack: config => {
        const plugins = [];
        if (isProduction) {
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                }),
            );
        }
        config.plugins = [
            ...config.plugins,
            ...plugins
        ];
    }
};

