/**
 *------------------------------------------------------------------------------
 *
 *  Autoresize Textarea On Keypress
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const autoresize = function() {
        node.update(this, {
            style: { height: `${this.scrollHeight}px` }
        });
    };


    directive.on('autoresize', autoresize);

});
