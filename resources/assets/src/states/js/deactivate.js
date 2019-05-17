/**
 *------------------------------------------------------------------------------
 *
 *  Deactivate Element Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let attribute = 'data-deactivate';


    const deactivate = function() {
        state.deactivate( dom.id( this.getAttribute(attribute) ) );
    };


    directive.on('deactivate', deactivate);

});
