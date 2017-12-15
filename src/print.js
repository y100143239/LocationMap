function printMe() {
    console.log( 'I get called from print.js!' );
    // console.error( 'I am an error!' );
}

function printHer() {
    console.log( "She is a girl!" );
}

export { printMe, printHer };