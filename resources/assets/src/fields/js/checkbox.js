/**
 *------------------------------------------------------------------------------
 *
 *  Simplify Handling Field States
 *
 *  Modifiers Were Originally Dependent On Form Element ':focus' ':checked'
 *  Selectors To Modify States Resulting In Long Selectors Once Compiled.
 *
 *  JS Unifies States By Shifting Modifiers To Parent
 *  - Also Enables Sticking To A Unified State System Across All Modules!
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let events = {
            change: new Event('change')
        };


    const checkbox = function(e) {
        let field = this,
            tag = e.target;

        state[tag.checked ? 'activate' : 'deactivate'](field);

        if (tag.checked && tag.type === 'radio') {
            let siblings = dom.names(tag.name);

            if (!siblings) { 
                return;
            }

            for(let i = 0, n = siblings.length; i < n; i++) {
                let sibling = siblings[i];

                // Trigger Deactivation Of Unchecked Siblings
                if (tag !== sibling) {
                    sibling.dispatchEvent(events.change);
                }
            }
        }
    };


    directive.on('checkbox', checkbox);

});
