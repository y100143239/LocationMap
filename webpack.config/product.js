const webpack = require( "webpack" );
const merge = require( "webpack-merge" );
const UglifyJSPlugin = require( "uglifyjs-webpack-plugin" );
const common = require( "./common.js" );

module.exports = merge( common, {
    devtool: "source-map",
    plugins: [
        new UglifyJSPlugin( {
            uglifyOptions: {
                // ie8 支持
                ie8: true,
                sourceMap: true
            }
        } ),
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "production" )
            }
        } )
    ]
} );