const path = require( "path" );
// 抽取CSS样式为单独的文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractForSrc = new ExtractTextPlugin( "form-style.css" );
const extractForDist = new ExtractTextPlugin( "style.css" );
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {

    // devtool: 'inline-source-map',

    externals: {
        jquery: 'jQuery'
    },

    entry: {
        app: './src/index.js'
    },

    plugins: [
        extractForSrc,
        extractForDist,
        // new UglifyJSPlugin()
    ],

    output: {
        filename: 'locationMap.js',
        path: path.resolve( __dirname, "dist/asset/js" )
    },

    module: {

        rules: [

            /** 抽取 css文件到 单独的文件 */
            {
                test: /\.css$/,
                include: [ path.resolve(__dirname, "src") ],
                use: extractForSrc.extract( {
                    fallback: "style-loader",
                    use: "css-loader"
                } )
            },

            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, "dep")
                ],
                use: extractForDist.extract( {
                    fallback: "style-loader",
                    use: "css-loader"
                } )
            },


            /** 载入 图片，CSS文件中使用到的图片，都会被载入 */
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [ "file-loader" ]
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'babel-preset-es2015' ]
                    }
                }
            },

        ]

    }
};