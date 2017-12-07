/**
 * @fileOverview 角色
 * @author 吴钦飞（wuqinfei@qq.com）
 */
define( [ "../lib/pixi/4.6.1/pixi", "./config" ], function ( PIXI, Config ) {
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
            sprite
        ;

        sprite = new PIXI.Sprite(
            PIXI.loader.resources[ this.personInfo.type ].texture
        );

        sprite.scale.set( 0.2, 0.2 );

        this.charactorContainer.addChild( sprite );

        this.sprite = sprite;
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

            this.sprite.position.set( this.position_2D.x, this.position_2D.y );
        }

    };

    Character.prototype.destroy = function () {

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