
require( "../dep/jquery.panzoom/3.2.2.x/jquery.panzoom" );

// const Scene = require( "./Scene" );
import {Scene} from "./Scene";
import {Config} from "./Config";

window.LocationMap = Scene;

window.LocationMap.Config = Config;

console.info( Scene );