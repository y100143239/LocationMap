const path = require( "path" );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );

module.exports = {

    entry: {
        app: './src/index.js'
    },

    plugins: [
        // 清除 dist 目录
        new CleanWebpackPlugin( [ 'dist' ] ),

        // 生成 index.html 文件
        new HtmlWebpackPlugin( {
            title: 'production'
        } )

    ],

    output: {
        filename: '[name].bundle.js',
        path: path.resolve( __dirname, "../dist" )
    },

    module: {
        rules: [
            /**
             * 将 css文件 以<style>标签的方式插入 <head>
             */
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            /**
             * 载入 图片，CSS文件中使用到的图片，都会被载入
             */
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            }
        ]
    }
};