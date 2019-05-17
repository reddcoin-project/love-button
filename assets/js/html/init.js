/*************************************************
* Initialization
* Setup initial state and extension settings
*************************************************/

var COIN = 0.00000001;
var RDD_DEBUG_MODE = true,

dbg = function(variable) {
    //console.log("Debug MODE == " + RDD_DEBUG_MODE)
    //if(RDD_DEBUG_MODE !== true){
    //    return;
    //}

    console.log("DB: " + variable);
};

setDebug(true);

function setDebug(isDebug) {
    if (isDebug) {
        window.debug = {
            //log: window.console.log.bind(window.console, '%s: %s'),
            log: window.console.log.bind(window.console, 'log: %s'),
            error: window.console.error.bind(window.console, 'error: %s'),
            info: window.console.info.bind(window.console, 'info: %s'),
            warn: window.console.warn.bind(window.console, 'warn: %s')
        };
    }
    else {
        var __no_op = function() {};

        window.debug = {
            log: __no_op,
            error: __no_op,
            warn: __no_op,
            info: __no_op
        };
    }
}


// ...


/*
debug.log('wat', 'Yay custom levels.'); // -> wat: Yay custom levels.    (line X)
debug.info('This is info.');            // -> info: This is info.        (line Y)
debug.warn('I warned ya.');
debug.error('Bad stuff happened.');
*/
exports = {};
Reddcoin = exports;
