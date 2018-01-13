
require( "../dep/jquery.panzoom/3.2.2.x/jquery.panzoom" );

const jQuery = require("jquery");
const Config = require( "./Config" );
const Scene = require( "./Scene" );


var
    LocationMap = {}
;
/**
 * @description 默认参数
 */
LocationMap.defaults = {
    /** web socket */
    "webSocket_url": "ws://localhost:8080/pkui/noauth/websocket/getPosition",
    "webSocket_onOpen": "establishSocketCallback",
    "webSocket_onMessage": "receivedMessageCallback",
    "webSocket_onClose": "closeSocketCallback",
    "webSocket_onError": "socketErrorCallback",
    /** 请求 人员信息列表 的URL */
    "personInfoListUrl": "../test/personInfoListData.json",
    /** 点击定位标签后的回调（函数名） */
    "onClickPerson": "clickPersonCallback",
    /** 资源目录 */
    "resourcesDir": "./asset/",
    /** 坐标转换器（函数名） */
    "positionConverter": "positionConverter"
};

/**
 * @description 初始化
 */
LocationMap.init = function () {
    this.declare();
    this.start();
};

/**
 * @description 声明
 */
LocationMap.declare = function () {

    this.$target = jQuery( "[data-toggle=\"LocationMap\"]" );

    this.options = jQuery.extend( true, {}, this.defaults, this.$target.data( "options" ) );

};

/**
 * @description 设置 Config 的参数
 */
LocationMap.setConfigOptions = function () {

    Config.personInfoListUrl = this.options.personInfoListUrl;

    if ( this.options.positionConverter ) {
        Config.convertPosition = window[ this.options.positionConverter ];
    }
};

/**
 * @description 开始
 */
LocationMap.start = function () {
    var
        _this = this
    ;

    this.setConfigOptions();

    this.requestPersonInfoList( function () {
        _this.createScene( function () {
            _this.createWebSocket();
        } );
    } );
};

/**
 * @description 请求人员信息列表
 * @param callback
 */
LocationMap.requestPersonInfoList = function ( callback ) {
    console.info( "1/3：【请求人员信息列表】..." );

    Config.requestPersonInfoList( function () {
        console.info( "1/3：【请求人员信息列表】成功！" );
        callback && callback();
    }, function () {
        console.error( "1/3：【请求人员信息列表】失败！" );
    } );
};

/**
 * @description 创建场景
 * @param callback
 */
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

/**
 * @description 创建 web socket 连接
 */
LocationMap.createWebSocket = function () {
    var
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


/**
 * @description DOM书构建完毕后初始化
 */
jQuery( document ).ready( function () {
    LocationMap.init();
} );

/**
 * @description 在地图上标记位置
 * @param position {{cmd: number, id: string, x: number, y: number}}
 */
LocationMap.markPosition = function ( position ) {
    LocationMap.scene.setCharacter( position );
};

/**
 * @description 暴露出去
 * @type {{markPosition: LocationMap.markPosition|*, getPersonInfoById: *}}
 */
window.LocationMap = {
    markPosition: LocationMap.markPosition,
    getPersonInfoById: Config.getPersonInfoById
};