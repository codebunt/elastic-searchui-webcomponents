const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = ({ mode }) => {
    return {
        mode,
        output: {
            path: __dirname + '/dist',
            publicPath: '/',
            filename: 'es-searchui-wc.js'
        },      
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                minify: false
            }),
            new CopyWebpackPlugin([
                {
                    context: 'node_modules/@webcomponents/webcomponentsjs',
                    from: '**/*.js',
                    to: 'webcomponents'
                }
            ])
        ],
        module: {
            rules: [
                { test: /\.css$/, use: 'raw-loader' }
            ]
        },
        devtool: mode === 'development' ? 'source-map' : 'none'
    };
};