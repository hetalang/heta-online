// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

    const config = {
        entry: {
            //'jquery': './src/jquery.js', // jquery lib
            'gtag-config': {import: './src/gtag-config.js'},
            'app': {import: './src/app.js', dependOn: 'gtag-config'}, // load gtag-config first
            //'style': './src/style.js', // CSS files
        },
        devtool: 'source-map',
        cache: {
            type: 'filesystem',
        },
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
            // Learn more about plugins from https://webpack.js.org/configuration/plugins/
            new HtmlWebpackPlugin({
                template: 'src/index.html',
            }),
            new MonacoWebpackPlugin({
                languages: ['json', 'plaintext', 'yaml', 'xml', 'markdown', 'c', 'julia', 'cpp', 'r', 'html']
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                Buffer: [require.resolve('buffer/'), 'Buffer'],
                process: require.resolve('process/browser')
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'node_modules/heta-compiler/src/builder/declaration-schema.json'),
                        to: path.resolve(__dirname, 'dist/declaration-schema.json'),
                    },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/i,
                    use: [stylesHandler, 'css-loader'],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: 'asset',
                },
                // Add your rules for custom modules here
                // Learn more about loaders from https://webpack.js.org/loaders/
            ],
        },
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
                path: require.resolve('path-browserify'),
                process: require.resolve('process/browser'),
                stream: false,
                os: false,
                util: require.resolve('util/'),
            },
        },
    };

    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        config.optimization = {
            minimize: true,
            minimizer: [
                '...',
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
