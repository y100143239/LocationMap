/**
 * @fileOverview 角色
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define( [ "../lib/pixi/4.6.1/pixi", "./config", "../lib/jquery/2.2.4/jquery" ], function ( PIXI, Config ) {
    "use strict";

    /**
     * @description 构造函数
     * @constructor
     */
    function Character ( charactorContainer, options ) {
        this.charactorContainer = charactorContainer;
        this._declare( options );
    }

    /**
     * @description 默认参数
     * @type {{}}
     */
    Character.prototype.defaults = {

    };

    /**
     * @description 声明
     * @param options
     * @private
     */
    Character.prototype._declare = function ( options ) {

        /**
         * @description 传入的参数
         * @type {{}}
         */
        this.options = this.getOptions( options );

        /**
         * @description sprite
         * @type {PIXI.Container}
         */
        this.pixiContainer = null;

        /**
         * @description 人员信息
         * @type {{id: string, name: string, type: string}}
         */
        this.personInfo = Config.getPersonInfoById( this.options.id );

        /**
         * @description CAD图上对应的坐标
         * @type {{x: number, y: number}}
         */
        this.position_CAD = {
            // x: 0,
            // y: 0
        };

        /**
         * @description 2D图上的位置
         * @type {{x: number, y: number}}
         */
        this.position_2D = {
            // x: 0,
            // y: 0
        };


    };

    /**
     * @description 创建
     */
    Character.prototype.create = function () {
        var
            pixiSprite,
            pixiText,
            personInfo = this.personInfo,
            color = Config.getColor( personInfo.type ),
            graphics = new PIXI.Graphics(),
            pixiContainer = new PIXI.Container()
        ;

        // 图片
        pixiSprite = new PIXI.Sprite(
            PIXI.loader.resources[ personInfo.type ].texture
        );
        // var rate = pixiSprite.width / pixiSprite.height;
        // pixiSprite.width = 32;
        // pixiSprite.height = 32 / rate;


        // 文字
        pixiText = new PIXI.Text( personInfo.name, {
            // fontFamily: "Microsoft Yahei",
            fontSize: 14,
            fill : color.text
        } );
        pixiText.position.set( 0, pixiSprite.height );

        pixiSprite.position.set( ( pixiText.width - pixiSprite.width ) / 2, 0 );

        // 文字框
        graphics.lineStyle( 1, color.border, 1 );
        graphics.beginFill( color.background, 1 );
        graphics.drawRect( pixiText.position.x - 1 , pixiText.position.y - 1, pixiText.width + 2, pixiText.height + 2 );

        pixiContainer.addChild( pixiSprite );

        pixiContainer.addChild( graphics );

        pixiContainer.addChild( pixiText );

        // Opt-in to interactivity
        pixiContainer.interactive = true;
        // Shows hand cursor
        pixiContainer.buttonMode = true;

        pixiContainer.on( "pointerdown", function () {
            // alert( "【" + personInfo.id + ", " + personInfo.name + "】被点击了！" );
            jQuery( document ).trigger( "click.character", personInfo );
        });

        this.charactorContainer.addChild( pixiContainer );

        this.pixiContainer = pixiContainer;
    };
    /**
     * @description 更新
     * @param options {{ id: String, x: Number, y: Number}}
     */
    Character.prototype.update = function ( options ) {

        if ( this.position_CAD.x !== options.x || this.position_CAD.y !== options.y ) {

            this.position_CAD.x = options.x;
            this.position_CAD.y = options.y;

            this.position_2D = Config.convertPosition( this.position_CAD );

            this.pixiContainer.position.set( this.position_2D.x - this.pixiContainer.width / 2, this.position_2D.y  - this.pixiContainer.height / 2 );
        }

    };

    /**
     * @description 销毁
     */
    Character.prototype.destroy = function () {
        this.charactorContainer.removeChild( this.pixiContainer );
    };

    /**
     * @description 隐藏
     */
    Character.prototype.hide = function () {
        this.pixiContainer.visible = false;
    };

    /**
     * @description 显示
     */
    Character.prototype.show = function () {
        this.pixiContainer.visible = true;
    };

    /**
     * @description 获取参数
     * @param options
     * @return {{}}
     */
    Character.prototype.getOptions = function ( options ) {
        var
            propName
        ;
        if ( options ) {
            this.options = this.options || {};
            for ( propName in this.defaults ) {
                if ( ! this.defaults.hasOwnProperty( propName ) ) {
                    continue;
                }
                this.options[ propName ] = this.defaults[ propName ];
            }

            for ( propName in options ) {
                if ( ! options.hasOwnProperty( propName ) ) {
                    continue;
                }
                this.options[ propName ] = options[ propName ];
            }
        }
        return this.options;
    };

    return Character;
} );