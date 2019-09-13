/**
 *------------------------------------------------------------------------------
 *
 *  Activate/Deactivate Frames
 *
 */

require(['directive'], function(directive) {

    'use strict';


    const refresh = function() {
        browser.tabs.reload();
    };


    directive.on('refresh', refresh);

});
