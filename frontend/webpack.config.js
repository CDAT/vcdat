module.exports = {
    entry: __dirname + "/src/js/App.js",
    devtool: 'source-map',
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
        }]
    }
};
