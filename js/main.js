/**
 * @fileOverview 入口
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define( [ "./scene", "./config", "../lib/jquery/2.2.4/jquery" ], function ( Scene, Config ) {
    "use strict";
    var
        scene,
        sceneOptions,
        configOptions,
        $target
    ;

    jQuery( document ).ready( function () {

        $target = jQuery( "#container" );

        sceneOptions = $target.data( "sceneOptions" );
        sceneOptions.targetId = $target.get( 0 ).id;
        configOptions = $target.data( "configOptions" );

        scene = new Scene( sceneOptions );

        scene.init( function () {

            Config.init( configOptions, function () {
                // scene.setCharacter( { cmd: 1, id: "56780", x: 20, y: 20 } );

                scene.setCharacter( { cmd: 1, id: "56780", x: 336274/10, y: -331342/10 } );
                scene.setCharacter( { cmd: 1, id: "56782", x: 340274/10, y: -331342/10 } );
                scene.setCharacter( { cmd: 1, id: "56786", x: 344274/10, y: -331342/10 } );
                scene.setCharacter( { cmd: 1, id: "56781", x: 336274/10, y: -335342/10 } );
                scene.setCharacter( { cmd: 1, id: "56783", x: 340274/10, y: -335342/10 } );
                scene.setCharacter( { cmd: 1, id: "56787", x: 344274/10, y: -335342/10 } );

            } );


        } );

        window.scene = scene;
    } );

} );