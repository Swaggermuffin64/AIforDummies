const path = require('path') //path module
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    "entry": "./src/index.js",                  //entry is the file webpack starts parsing the project
    "output": {
        path: path.resolve(__dirname, 'dist'),  //sets webpack's output path
        filename: "bundle.js"
    },
    module: {                                   //rules for different kinds of files
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader"             //use babel for js or jsx
            },
            {
                test: /\.css$/,                  // use style/css loader for css files 
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
}