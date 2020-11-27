const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, 'example/main'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'umd'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader"
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
}