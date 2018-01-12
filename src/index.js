
require( "../dep/jquery.panzoom/3.2.2.x/jquery.panzoom" );

// const Scene = require( "./Scene" );
const jQuery = require("jquery");
import {Scene} from "./Scene";
import {Config} from "./Config";


let
    LocationMap = {},
    defaults
;
/**
 * @description 默认参数
 * @type {{webSocket_url: string, webSocket_onOpen: string, webSocket_onMessage: string, webSocket_onClose: string, webSocket_onError: string, personInfoListUrl: string, onClickPerson: string, resourcesDir: string, positionConverter: string}}
 */
LocationMap.defaults = {
    "webSocket_url": "ws://localhost:8080/pkui/noauth/websocket/getPosition",
    "webSocket_onOpen": "establishSocketCallback",
    "webSocket_onMessage": "receivedMessageCallback",
    "webSocket_onClose": "closeSocketCallback",
    "webSocket_onError": "socketErrorCallback",
    "personInfoListUrl": "../test/personInfoListData.json",
    "onClickPerson": "clickPersonCallback",
    "resourcesDir": "./asset/",
    "positionConverter": "positionConverter"
};

LocationMap.init = function () {
    this.declare();
    this.start();
};
LocationMap.declare = function () {

    this.$target = jQuery( "[data-toggle=\"LocationMap\"]" );

    this.options = jQuery.extend( true, {}, this.defaults, this.$target.data( "options" ) );

};

LocationMap.setConfigOptions = function () {

    Config.personInfoListUrl = this.options.personInfoListUrl;

    if ( this.options.positionConverter ) {
        Config.convertPosition = window[ this.options.positionConverter ];
    }
};

LocationMap.start = function () {
    let
        _this = this
    ;

    this.setConfigOptions();

    this.requestPersonInfoList( function () {
        _this.createScene( function () {
            _this.createWebSocket();
        } );
    } );
};

LocationMap.requestPersonInfoList = function ( callback ) {
    console.info( "1/3：【请求人员信息列表】..." );

    Config.requestPersonInfoList( function () {
        console.info( "1/3：【请求人员信息列表】成功！" );
        callback && callback();
    }, function () {
        console.error( "1/3：【请求人员信息列表】失败！" );
    } );
};

LocationMap.createScene = function ( callback ) {
    console.info( "2/3：【创建场景】..." );
    this.scene = new Scene( this.$target.get( 0 ), {
        resourcesDir: this.options.resourcesDir,
        onClickPerson: window[ this.options.onClickPerson ]
    } );

    this.scene.init( function () {
        console.info( "2/3：【创建场景】成功！" );
        callback && callback();
    } );
};

LocationMap.createWebSocket = function () {
    let
        options = this.options,
        onOpenCallback = window[ options.webSocket_onOpen ] ,
        onMessageCallback = window[ options.webSocket_onMessage ],
        onCloseCallback = window[ options.webSocket_onClose ],
        onErrorCallback = window[ options.webSocket_onError ],
        webSocket
    ;

    onOpenCallback = onOpenCallback || function () { console.info( "【web socket】连接创建成功！" ); };
    onCloseCallback = onCloseCallback || function () { console.info( "【web socket】连接关闭！" ); };
    onErrorCallback = onErrorCallback || function () { console.info( "【web socket】连接出错！" ); };

    console.info( "3/3：【创建 WebSocket 连接】..." );

    webSocket = new WebSocket( options.webSocket_url );

    webSocket.onmessage = onMessageCallback;

    webSocket.onopen = onOpenCallback;

    webSocket.onerror = onErrorCallback;

    webSocket.onclose = onCloseCallback;
};


function init() {
    let
        $target = jQuery( "[data-toggle=\"LocationMap\"]" ),
        options,
        scene,
        webSocket,
        positionConverter
    ;
    if ( $target.size() > 1 ) {
        throw  "不满足条件：target 元素有且仅有一个。";
    }



    options = $target.data( "options" );

    positionConverter = window[ options.positionConverter ];

    if ( jQuery.isFunction( positionConverter ) ) {
        Config.convertPosition = positionConverter;
    }


    [
        "webSocket_url",
        "webSocket_onMessage",
        "personInfoListUrl",
        "resourcesDir"
    ].forEach( function ( propName ) {
        if ( ! options.hasOwnProperty( propName ) ) {
            throw "未指定【" + propName + "】参数";
        }
    } );

    // 1. 请求人员信息列表
    console.info( "1/3：【请求人员信息列表】..." );
    Config.personInfoListUrl = options.personInfoListUrl;
    Config.requestPersonInfoList( function () {
        console.info( "1/3：【请求人员信息列表】成功！" );
        createScene();
    }, function () {
        console.error( "1/3：【请求人员信息列表】失败！" );
    } );

    // 2. 创建场景
    function createScene () {
        console.info( "2/3：【创建场景】..." );
        scene = new Scene( $target.get( 0 ), {
            resourcesDir: options.resourcesDir,
            onClickPerson: window[ options.onClickPerson ]
        } );

        LocationMap.scene = scene;

        scene.init( function () {
            console.info( "2/3：【创建场景】成功！" );
            doWebSocket();
        } );

    }

    // 3. 创建 WebSocket 连接
    function doWebSocket() {
        let
            onOpenCallback = window[ options.webSocket_onOpen ] ,
            onMessageCallback = window[ options.webSocket_onMessage ],
            onCloseCallback = window[ options.webSocket_onClose ],
            onErrorCallback = window[ options.webSocket_onError ]
        ;

        onOpenCallback = onOpenCallback || function () { console.info( "【web socket】连接创建成功！" ); };
        onCloseCallback = onCloseCallback || function () { console.info( "【web socket】连接关闭！" ); };
        onErrorCallback = onErrorCallback || function () { console.info( "【web socket】连接出错！" ); };

        console.info( "3/3：【创建 WebSocket 连接】..." );

        webSocket = new WebSocket( options.webSocket_url );

        webSocket.onmessage = onMessageCallback;

        webSocket.onopen = onOpenCallback;

        webSocket.onerror = onErrorCallback;

        webSocket.onclose = onCloseCallback;
    }
}


jQuery( document ).ready( function () {
    LocationMap.init();
} );

LocationMap.markPosition = function ( position ) {
    LocationMap.scene.setCharacter( position );
};

window.LocationMap = {
    markPosition: LocationMap.markPosition,
    getPersonInfoById: Config.getPersonInfoById
};