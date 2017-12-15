const path = require( "path" );

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve( __dirname, "dist" )
    },
    module: {
        rules: [
            /**
             * 将 css文件 以<style>标签的方式插入 <head>
             */
            {
                test: /\.css$/,
                use: [
                    // "style-loader",
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