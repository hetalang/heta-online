// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require('webpack');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
    entry: {
        //'jquery': './src/jquery.js', // jquery lib
        //'app': {import: './src/app.js', dependOn: 'jquery'},
        'app': {import: './src/app.js'},
        //'style': './src/style.js', // CSS files
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
        //libraryTarget: 'umd',
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new MonacoWebpackPlugin({
            languages: ['json', 'plaintext', 'yaml', 'xml', 'markdown', 'c', 'julia', 'cpp', 'r', 'html']
        }),
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader','css-minify'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader',
                options: {
                    config: __dirname + '/node_modules/heta-compiler/src/nunjucks-env', // '/nunjucks.config.js'
                    //quiet: true // Don't show the 'Cannot configure nunjucks environment before precompile'
                }
            }
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {keep_classnames: true} // important because of Classes in heta-compiler, fix there first
                }),
                new CssMinimizerPlugin(),
            ],
            splitChunks: {
                chunks: 'all',
                minSize: 10000
            },
        };
    } else {
        config.mode = 'development';
    }
    return config;
};
