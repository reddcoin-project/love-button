/**
 *------------------------------------------------------------------------------
 *
 *  Drag To Scroll Horizontally
 *
 */

require(['dom', 'directive', 'emitter', 'node'], function(dom, directive, emitter, node) {

    'use strict';


    let elements = new Map();


    const drag = function(e) {
        let data = elements[this] || {};

        if (!data.mouseDown) {
            return;
        }

        e.preventDefault();

        node.update(this, {
            attribute: {
                scrollLeft: data.scrollLeft - ((e.pageX - this.offsetLeft) - data.startX)
            }
        });
    };

    const start = function(e) {
        elements[this] = {
            mouseDown: true,
            scrollLeft: this.scrollLeft,
            startX: e.pageX - this.offsetLeft
        };
    };

    const stop = function(e) {
        elements[this] = {
            mouseDown: false,
            scrollLeft: 0,
            startX: 0
        };
    };


    directive.on('drag.move',  drag);
    directive.on('drag.start', start);
    directive.on('drag.stop',  stop);

});
