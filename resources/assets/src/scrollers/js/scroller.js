/**
 *------------------------------------------------------------------------------
 *
 *  Horizontal Scrolling Using Scroll Wheel
 *
 */

require(['dom', 'directive', 'emitter', 'node'], function(dom, directive, emitter, node) {

    'use strict';


    let ref = 'scroller',
        multiplier = 32;


    const mount = () => {
        let scrollers = dom.refs(ref);

        for (let i = 0, n = scrollers.length; i < n; i++) {
            let scroller = scrollers[i];

            let css = window.getComputedStyle(scroller.parentNode),
                height = parseInt(scroller.firstElementChild.clientHeight || 0)
                       + parseInt(css.paddingTop)
                       + parseInt(css.paddingBottom);

            node.update(scroller.parentNode, {
                style: { height: `${height}px` }
            });
        }
    };

    const wheel = function(e) {
        // Scroll Up
        if ((- e.deltaY / 3) === 1) {
            if (this.scrollLeft < 1) {
                return;
            }
        }
        // Scroll Down
        else {
            if (this.scrollLeft >= this.scrollLeftMax) {
                return;
            }
        }

        e.preventDefault();
        e.stopPropagation();

        node.update(this, {
            attribute: {
                scrollLeft: this.scrollLeft - (Math.max(-1, Math.min(1, (- e.deltaY / 3))) * multiplier)
            }
        });
    };


    directive.on('scroller', wheel);
    emitter.on('modules.mount', mount);

});
