/**
 *------------------------------------------------------------------------------
 *
 *  Activate Element Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let attribute = 'data-activate';


    const activate = function() {
        state.activate( dom.id( this.getAttribute(attribute) ) );
    };


    directive.on('activate', activate);

});
