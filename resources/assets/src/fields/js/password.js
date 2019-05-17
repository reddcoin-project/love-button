/**
 *------------------------------------------------------------------------------
 *
 *  Show/Hide Password
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const password = function() {
        let input = this.nextElementSibling;

        node.update(input, {
            attribute: { type: input.type === 'password' ? 'text' : 'password' }
        });
    };


    directive.on('password', password);

});
