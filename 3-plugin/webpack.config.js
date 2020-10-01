const path = require("path");
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
        filename: "[name].js",
        path: path.resolve("./dist")
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
                test: /\.(png|jpg|svg|gif)$/,
                loader: "url-loader",
                options: {
                    name: "[name].[ext]?[hash]",
                    limit: 10000 // 10Kb
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
                Author: ${childProcess.execSync('git config user.name')}
            `,
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
    /**
     * TODO: 아래 플러그인을 추가해서 번들 결과를 만들어 보세요.
     * 1. BannerPlugin: 결과물에 빌드 시간을 출력하세요.
     * 2. HtmlWebpackPlugin: 동적으로 html 파일을 생성하세요.
     * 3. CleanWebpackPlugin: 빌드 전에 아웃풋 폴더를 깨끗히 정리하세요.
     * 4. MiniCssExtractPlugin: 모듈에서 css 파일을 분리하세요.
     */
};
