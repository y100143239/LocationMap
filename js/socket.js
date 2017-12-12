/**
 * @fileOverview 对 window.WebSocket 的极简单的封装
 *
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define( [ "jquery", "./utils" ], function ( $, Utils ) {
    "use strict";

    var
        WebSocket = window.WebSocket
    ;

    $ = $ || window.jQuery;

    /**
     * @description 默认参数
     * @type {{url: string, onopen: function, onmessage: function, onerror: function, onclose: function}}
     */
    Socket.prototype.defaults = {

        /** web socket url */
        url: "ws://www.20ui.cn/noauth/websocket/getPosition",

        onopen: function () {
            Utils.log( "【WebSocket】Connection established!" );
        },

        /**
         * @description 处理服务器推送过来的消息
         * @param event
         * @param event.data {string}
         */
        onmessage: function ( event ) {
            // event.data
        },

        onerror: function () {
            Utils.log( "【WebSocket】Connection error!" );
        },

        onclose: function () {
            Utils.log( "【WebSocket】Connection closed!" );
        }
    };

    /**
     * @param options 参数
     *
     * @param options.onopen {function}
     * @param options.onmessage {function}
     * @param options.onerror {function}
     * @param options.onclose {function}
     *
     * @constructor
     */
    function Socket ( options ) {
        this.options = $.extend( true, {}, this.defaults, options );
        this.webSocket = null;
        this.isOpen = false;
    }

    /**
     * @description 开启
     */
    Socket.prototype.start = function () {
        var
            _this = this,
            options = this.options,
            webSocket
        ;

        if ( this.isOpen === true ) {
            this.defaults.onopen();
            return;
        }
        webSocket = this.webSocket = new WebSocket( options.url );

        webSocket.onopen = function () {
            _this.isOpen = true;
            options.onopen.apply( _this, arguments );
        };
        webSocket.onmessage = function () {
            options.onmessage.apply( _this, arguments );
        };
        webSocket.onerror = function () {
            options.onerror.apply( _this, arguments );
        };
        webSocket.onclose = function () {
            _this.isOpen = false;
            options.onclose.apply( _this, arguments );
        };
    };

    /**
     * @description 关闭
     */
    Socket.prototype.close = function () {
        this.webSocket.close();
        this.defaults.onclose();
        this.isOpen = false;
    };

    /**
     * @description 重启
     */
    Socket.prototype.restart = function () {
        this.close();
        this.start();
    };

    /**
     * @description 发送数据
     */
    Socket.prototype.send = function () {
        this.webSocket.send.apply( this.webSocket, arguments );
    };

    return Socket;
} );