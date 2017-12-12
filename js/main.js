requirejs.config( {
    paths: {
        "jquery": "../lib/jquery/2.2.4/jquery",
        "datgui": "../lib/dat.gui/0.6.5/dat.gui"
    },
    waitSeconds: 300
} );
/**
 * @fileOverview 入口
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define(
    [ "./scene", "./config", "jquery", "./socket", "datgui" ],
function ( Scene, Config, jQuery, Socket, Dat ) {
    "use strict";

    jQuery = jQuery || window.jQuery;

    /** @event click.character 角色被点击事件 */
    jQuery( document ).on( "pku.click.character", function ( event, personInfo ) {
        alert( "【" + personInfo.id + ", " + personInfo.name + "】被点击了！" );
    } );

    jQuery( document ).ready( function () {
        var
            scene,
            websocketUrl,
            socket,
            sceneOptions,
            configOptions,
            $target,

            datOptions,
            datGui
        ;

        $target = jQuery( "#container" );

        sceneOptions = $target.data( "sceneOptions" );
        sceneOptions.targetId = $target.get( 0 ).id;

        configOptions = $target.data( "configOptions" );

        websocketUrl = $target.data( "websocketUrl" );

        // 坐标相关的参数
        datOptions = {
            interval: 16,
            personNum: 1,
            xVelocity: 10,
            yVelocity: 10,
            minX: 31970,
            maxX: 35383,
            minY: -35994,
            maxY: -31121
        };

        // web socket
        socket = new Socket( {
            url: websocketUrl,
            onopen: function () {
                this.defaults.onopen();
                this.send( JSON.stringify( datOptions ) );
            },
            onmessage: function ( event ) {
                var
                    data = event.data
                ;
                if ( data ) {
                    try {
                        scene.setCharacter( JSON.parse( data ) );
                        // console.info( data );
                    } catch ( e ) {
                        console.info( data );
                    }
                }
            }
        } );

        // 控制器
        datGui = new Dat.GUI();
        // $target.append( datGui.domElement );
        datGui.add( datOptions, "interval", 1, 100).step(1).onFinishChange( function () {
            socket.restart();
        } );
        datGui.add( datOptions, "personNum", 1, 100).step(1).onFinishChange( function () {
            socket.restart();
        } );
        datGui.add( datOptions, "xVelocity", 1, 100).step(1).onFinishChange( function () {
            socket.restart();
        } );
        datGui.add( datOptions, "yVelocity", 1, 100).step(1).onFinishChange( function () {
            socket.restart();
        } );


        scene = new Scene( sceneOptions );

        scene.init( function () {

            Config.init( configOptions, function () {

                socket.start();

                // window.pkui_socket = socket;

                // scene.setCharacter( { cmd: 1, id: "56780", x: 20, y: 20 } );

                // scene.setCharacter( { cmd: 1, id: "56780", x: 336274/10, y: -331342/10 } );
                // scene.setCharacter( { cmd: 1, id: "56782", x: 340274/10, y: -331342/10 } );
                // scene.setCharacter( { cmd: 1, id: "56786", x: 344274/10, y: -331342/10 } );
                // scene.setCharacter( { cmd: 1, id: "56781", x: 336274/10, y: -335342/10 } );
                // scene.setCharacter( { cmd: 1, id: "56783", x: 340274/10, y: -335342/10 } );
                // scene.setCharacter( { cmd: 1, id: "56787", x: 344274/10, y: -335342/10 } );

            } );


        } );

        window.scene = scene;
    } );

} );