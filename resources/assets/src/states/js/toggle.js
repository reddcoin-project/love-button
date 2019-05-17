/**
 *------------------------------------------------------------------------------
 *
 *  Toggle State Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let active = [],
        attribute = 'data-toggle';


    const deactivate = (element) => {
        let index = active.indexOf(element);

        if (index > -1) {
            active.splice(index, 1);
        }

        state.deactivate(element);
    };

    const detoggle = (e) => {
        if (active.length === 0) {
            return;
        }

        let target = e.target;

        if (target) {
            target = dom.id( target.getAttribute(attribute) ) || target;
        }

        for (let i in active) {
            let element = active[i];

            if (element === target || element.contains(target)) {
                continue;
            }

            deactivate(element);
        }
    };

    const toggle = function(e) {
        let target = dom.id( this.getAttribute(attribute) ) || this,
            type = e.type;

        if (type === 'focus' || type === 'mouseenter') {
            type = 'activate';
        }
        else if (type === 'blur' || type === 'mouseleave') {
            type = 'deactivate';
        }
        else {
            type = 'toggle';
        }

        // 'target' Is Being Deactivated
        if (state.active(target)) {
            deactivate(target);

            if (target !== this) {
                deactivate(this);
            }
        }
        else {
            detoggle(e);

            if (target !== this) {
                active.push(this);
                state[type](this);
            }

            active.push(target);
            state[type](target);
        }
    };


    directive.on('root.click', detoggle);
    directive.on('toggle', toggle);

});
