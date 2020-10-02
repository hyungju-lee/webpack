const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: {
        main: "./src/app.js"
    },
    output: {
        path: path.resolve('./dist'),
        filename: "[name].js" // name - 위에 main 키네임을 가져온다.
    },
    devServer: {
        overlay: true,
        stats: "errors-only",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production' ?
                        MiniCssExtractPlugin.loader :
                        'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    // publicPath: './dist',
                    name: '[name].[ext]?[hash]', // name - 원본파일이름
                    limit: 20000, // 20kb
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
                Author: ${childProcess.execSync('git config user.name')}
            `
        }),
        new webpack.DefinePlugin({
            TWO: JSON.stringify('1+1'),
            'api.domain': JSON.stringify('http://dev.api.domain.com')
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            templateParameters: {
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : ''
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true,
                removeComments: true,
            } : false
        }),
        new CleanWebpackPlugin(),
        ...(process.env.NODE_ENV === 'production' ? [
                new MiniCssExtractPlugin({
                    filename: '[name].css' // 원본파일 이름 (이렇게 설정 안하면 해시값으로 내보냄), 근데 결국 js파일의 원본네임이니까 위의 main 키네임 가져오는 건 같음
                }),
            ] : []
        )
    ]
}