/**
 *------------------------------------------------------------------------------
 *
 *  Dispatch DOM Ready Event
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    function ready() {
        emitter.dispatch('dom.ready');
    }


    document.addEventListener('DOMContentLoaded', ready);

});
