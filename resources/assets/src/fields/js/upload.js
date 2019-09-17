/**
 *------------------------------------------------------------------------------
 *
 *  Change File Name On Upload
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const upload = function() {
        let mask = this.nextElementSibling;

        node.update(mask, {
            text: this.files[0].name
        });
    };


    directive.on('upload', upload);

});
