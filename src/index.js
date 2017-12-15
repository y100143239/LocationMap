
import _ from 'lodash';
import './style.css';
import config from "./config.json";

function component() {
    var element = document.createElement( 'div' );

    // Lodash, now imported by this script
    element.innerHTML = _.join( [ 'Hello', 'webpack' ], ' ' );

    console.info( config );

    return element;
}

document.body.appendChild( component() );