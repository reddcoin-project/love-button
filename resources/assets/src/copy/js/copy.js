/**
 *------------------------------------------------------------------------------
 *
 *  Copy Value To Clipboard
 *
 */

require(['directive', 'dom', 'modules/alert'], function(directive, dom, alert) {

    'use strict';


    let attribute = 'data-copy';


    const copy = function() {
        let target = dom.id( this.getAttribute(attribute) );

        if (!target) {
            return;
        }

        target.select();

        document.execCommand('copy');

        alert.success("Copied!");
    };


    directive.on('copy', copy);

});
