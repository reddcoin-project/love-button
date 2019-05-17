/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopmouseup',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mouseup'
            }
        ],
        rootkey = 'root.mouseup';


    document.addEventListener('mouseup', directive.delegate(options, rootkey), true);

});
