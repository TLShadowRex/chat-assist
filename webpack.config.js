const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports =
{
    entry: ['./src/electron.tsx', './src/asset/scss/main.scss'],
    target: 'electron-main',
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 5000

    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.es6', '.scss']
    },
    output: {
        path: path.resolve(__dirname, 'dist/')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: "postcss-loader", options: {
                            plugins: () => [require('autoprefixer')()],
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            modules: false
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'base64-inline-loader',
                    }
                ]
            }
        ]
    },
    externals: {
        'electron': 'require("electron")',
        'settings': 'require("electron-settings")',
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};