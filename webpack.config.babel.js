import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Visualizer from 'webpack-visualizer-plugin';
import webpack from 'webpack';
import {VueLoaderPlugin} from 'vue-loader';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const NODE_ENV = process.env.NODE_ENV;

const conf = {
    mode: NODE_ENV,
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            play$: 'trees-draw-play/dist/play.min'
        }
    },
    module: {
        rules: [
            {test: /\.vue$/, exclude: /node_modules/, use: 'vue-loader'},
            {test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
            {test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader']})}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html', inject: 'body', hash: 'true'}),
        new CopyWebpackPlugin([{from: './src/img', to: 'img'}]),
        new CopyWebpackPlugin([{from: './src/browserconfig.xml', to: '.'}]),
        new CopyWebpackPlugin([{from: './src/logo', to: 'logo'}]),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
        new VueLoaderPlugin(),
        new ExtractTextPlugin("style.css")
    ],
    externals: {
        vue: "Vue",
        'tree-draw-play': 'trees-draw-play',
        'vuetify':'Vuetify'
    }
};

if (conf.mode === "development") {
    conf.devServer = {
        host: "localhost",
        proxy: {
            "/api": "http://localhost:8080"
        }
    }
}

if (conf.mode === "production") {
    conf.plugins.push(new Visualizer({filename: '../../visualizer/statistics.html'}));
    conf.output = {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/show.blueforest.org/static'),
        libraryTarget: 'var',
        library: 'Show'
    };
    conf.plugins.push(new CopyWebpackPlugin([{from: 'nginx', to: '../nginx'}]));
}

module.exports = conf;