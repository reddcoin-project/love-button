/**
 *------------------------------------------------------------------------------
 *
 *  Activate/Deactivate Frames
 *
 */

require(['directive', 'dom', 'node', 'modules/state'], function(directive, dom, node, state) {

    'use strict';


    let attribute = 'data-frame',
        id = (k) => `frame-${k}`;


    const frame = function() {
        let target = dom.id( id(this.getAttribute(attribute)) ),
            trigger = this;

        if (!target) {
            target = dom.id(this.getAttribute(attribute));

            if (!target) {
                return;
            }
        }

        if (!state.active(target)) {
            state.deactivate(node.siblings(trigger).concat(node.siblings(target)));
            state.activate([trigger, target]);
        }
    };


    directive.on('frame', frame);

});
