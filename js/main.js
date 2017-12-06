/**
 * @fileOverview 入口
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define( [ "./scene", "../lib/jquery/2.2.4/jquery" ], function ( Scene ) {
    "use strict";
    var
        scene,
        options,
        $target
    ;

    jQuery( document ).ready( function () {

        $target = jQuery( "#container" );

        options = jQuery.extend( $target.data( "options" ), {
            targetId: $target.get( 0 ).id
        } );

        scene = new Scene( options );
        scene.init();

        window.scene = scene;
    } );

} );