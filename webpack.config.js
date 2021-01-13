const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const configFilePath = path.resolve(__dirname, 'config.json');

if (!fs.existsSync(configFilePath)) {
    console.error(
        'Could not find config.json ... have you copied (and modified if needed) config.template.json?'
    );
    process.exit(1);
}

var CONFIG = JSON.parse(fs.readFileSync(configFilePath));

module.exports = {
    entry: ['./src/js/main'],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'umd',
        filename: 'main.bundle.js',
    },

    optimization: {},

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),

        new webpack.DefinePlugin({
            // Declare global variables that will be passed to the web app JS code, and assign values from CONFIG
        }),
    ],

    devServer: {
        disableHostCheck: true, // Fix "Invalid host header" response
        contentBase: [path.resolve(__dirname, 'assets')],

        host: CONFIG.webServer.host,
        port: CONFIG.webServer.port,

        hot: false, // Disable hot-reloading of JS modules while the web app is running
        inline: false,
    },

    module: {
        rules: [
            {
                // Compile sass/scss, load css
                test: /\.(sass|scss|css)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                // Compile React/JSX
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                // Load fonts
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader'],
            },
        ],
    },
};
