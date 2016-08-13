var path = require('path');

module.exports = {
    entry: __dirname + "/src/js/App.js",
    devtool: 'inline-source-map',
    output: {
        path: __dirname + "/dist",
        filename: "Bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.svg$/,
            loader: 'svg-sprite',
            exclude: /fonts/
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=60000&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=60000',
            include: /fonts/
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.css$/,
            loader: 'style!css!postcss'
        }, {
            test: /\.c$/i,
            loader: 'shader',
        }, {
            test: /\.glsl$/i,
            loader: 'shader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.js$/,
            include: [
              /node_modules\/paraviewweb/,
              /node_modules\/vcs-js/
            ],
            loader: 'babel?presets[]=es2015',
          }]
    },
    resolve: {
        alias: {
            vcs: path.resolve('./node_modules/vcs-js/src/index'),
            ParaViewWeb: path.resolve('./node_modules/paraviewweb/src'),
            plotly: path.resolve('./node_modules/plotly.js/dist/plotly')
        }
    }
};
