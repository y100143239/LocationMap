+function () {
    var
        Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        // autoDetectRenderer = PIXI.CanvasRenderer,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Texture = PIXI.Texture,
        Sprite = PIXI.Sprite,
        Text = PIXI.Text,
        Graphics = PIXI.Graphics,
        resources,

        $container,


        stage,
        renderer,
        state,

        gameScene,
        blobs,
        blob,
        groundSprite,
        policeManSprite
    ;

    $container = document.getElementById( "container" );

    stage = new Container();
    renderer = autoDetectRenderer( 760, 820 );
    renderer.backgroundColor = 0xfefefe;

    $container.appendChild( renderer.view );

    loader
        .add( [
            { name: "ground", url: "./images/ground_3.png" },
            { name: "police_man", url: "./images/police_man.png" },
            { name: "animal_1", url: "./images/animal_1.png" }
        ] )
        .load( setup )
    ;

    function setup() {

        resources = loader.resources;

        // Make the game scene and add it to the stage
        gameScene = new Container();
        stage.addChild( gameScene );

        // 地面
        groundSprite = new Sprite( resources[ "ground" ].texture );

        groundSprite.width = 760;
        groundSprite.height = 820;

        gameScene.addChild( groundSprite );

        // 人
        policeManSprite = new Sprite( resources[ "police_man" ].texture );
        policeManSprite.scale.x = 0.1;
        policeManSprite.scale.y = 0.1;
        policeManSprite.vx = 0;
        policeManSprite.vy = 0;
        gameScene.addChild( policeManSprite );


        // An array to store all the blob monsters
        var numberOfBlobs = 80,
            spacing = 9,
            xOffset = 15,
            speed = 2,
            direction = 1
        ;
        blobs = [];
        for (var i = 1; i <= numberOfBlobs; i++) {
            blob = new Sprite( resources[ "animal_" + 1 ].texture );
            blob.scale.set( 0.1, 0.1 );
            blob.x = randomInt( 0, stage.height - blob.height );
            blob.y = spacing * i + xOffset;
            blob.vx = speed * direction;

            direction *= -1;

            blobs.push( blob );
            gameScene.addChild( blob );
        }

        //Capture the keyboard arrow keys
        var left = keyboard(37),
            up = keyboard(38),
            right = keyboard(39),
            down = keyboard(40);

        //Left arrow key `press` method
        left.press = function() {

            //Change the policeManSprite's velocity when the key is pressed
            policeManSprite.vx = -5;
            policeManSprite.vy = 0;
        };

        //Left arrow key `release` method
        left.release = function() {

            //If the left arrow has been released, and the right arrow isn't down,
            //and the policeManSprite isn't moving vertically:
            //Stop the policeManSprite
            if (!right.isDown && policeManSprite.vy === 0) {
                policeManSprite.vx = 0;
            }
        };

        //Up
        up.press = function() {
            policeManSprite.vy = -5;
            policeManSprite.vx = 0;
        };
        up.release = function() {
            if (!down.isDown && policeManSprite.vx === 0) {
                policeManSprite.vy = 0;
            }
        };

        //Right
        right.press = function() {
            policeManSprite.vx = 5;
            policeManSprite.vy = 0;
        };
        right.release = function() {
            if (!left.isDown && policeManSprite.vy === 0) {
                policeManSprite.vx = 0;
            }
        };

        //Down
        down.press = function() {
            policeManSprite.vy = 5;
            policeManSprite.vx = 0;
        };
        down.release = function() {
            if (!up.isDown && policeManSprite.vx === 0) {
                policeManSprite.vy = 0;
            }
        };

        //Set the game state
        state = play;

        //Start the game loop
        gameLoop();

    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        state();
        renderer.render( stage );
        // setInterval( function () {
        // }, 60 )
    }

    function play() {

        //Use the policeManSprite's velocity to make it move
        policeManSprite.x += policeManSprite.vx;
        policeManSprite.y += policeManSprite.vy;

        //Contain the policeManSprite inside the area of the dungeon
        contain(policeManSprite, {x: 28, y: 10, width: 760, height: 820});

        //Set `explorerHit` to `false` before checking for a collision
        var explorerHit = false;

        //Loop through all the sprites in the `enemies` array
        blobs.forEach(function(blob) {

            //Move the blob
            blob.x += blob.vx;

            //Check the blob's screen boundaries
            var blobHitsWall = contain(blob, {x: 28, y: 10, width: 760, height: 820});

            //If the blob hits the top or bottom of the stage, reverse
            //its direction
            if (blobHitsWall === "left" || blobHitsWall === "right") {
                blob.vx *= -1;
            }

            //Test for a collision. If any of the enemies are touching
            //the policeManSprite, set `explorerHit` to `true`
            // if(hitTestRectangle(policeManSprite, blob)) {
            //     explorerHit = true;
            // }
        });

        // //If the policeManSprite is hit...
        // if(explorerHit) {
        //
        //     //Make the policeManSprite semi-transparent
        //     policeManSprite.alpha = 0.5;
        //
        // } else {
        //
        //     //Make the policeManSprite fully opaque (non-transparent) if it hasn't been hit
        //     policeManSprite.alpha = 1;
        // }

    }



    /* Helper functions */

    function contain(sprite, container) {

        var collision = undefined;

        //Left
        if (sprite.x < container.x) {
            sprite.x = container.x;
            collision = "left";
        }

        //Top
        if (sprite.y < container.y) {
            sprite.y = container.y;
            collision = "top";
        }

        //Right
        if (sprite.x + sprite.width > container.width) {
            sprite.x = container.width - sprite.width;
            collision = "right";
        }

        //Bottom
        if (sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
            collision = "bottom";
        }

        //Return the `collision` value
        return collision;
    }

    //The `hitTestRectangle` function
    function hitTestRectangle(r1, r2) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    };


    //The `randomInt` helper function
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //The `keyboard` helper function
    function keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function(event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function(event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }

}();