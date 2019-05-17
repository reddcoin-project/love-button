/**
 *------------------------------------------------------------------------------
 *
 *  On Select Change Update Mask
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const select = function(e) {
        let mask = this.firstElementChild,
            tag = e.target;

        node.update(mask, {
            text: tag.options[tag.selectedIndex].text
        });
    };


    directive.on('select', select);

});
