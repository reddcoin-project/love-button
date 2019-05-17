/**
 *------------------------------------------------------------------------------
 *
 *  Trigger Delegated DOM Events On Mounted
 *
 */

require(['dom', 'emitter', 'node'], function(dom, emitter, node) {

    'use strict';


    let events = [
            'blur',
            'change',
            'click',
            'focus',
            'hover',
            'keydown',
            'scroll',
            'wheel'
        ],
        prefix = 'trigger:';


    function dispatch(elements, type) {
        let e = new Event(type);

        for (let i = 0, n = elements.length; i < n; i++) {
            elements[i].dispatchEvent(e);
        }
    }

    function mounted() {
        for (let i = 0, n = events.length; i < n; i++) {
            let elements = dom.refs(`${prefix}${events[i]}`),
                type = events[i];

            if (elements) {
                dispatch(elements, type);
            }
        }
    }


    emitter.on('modules.mounted', mounted);

});
