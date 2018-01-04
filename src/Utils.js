let
    Utils = {}
;

/**
 * @description 日志
 * @param content
 * @public
 */
Utils.log = function ( content ) {
    let
        date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        milliseconds = date.getMilliseconds(),
        time
    ;

    milliseconds = ("   " + milliseconds).slice( -3 );

    time = hours + "时" + minutes + "分" + seconds + "秒 " + milliseconds + "毫秒: ";

    console.info( time, content );
};

export {Utils};