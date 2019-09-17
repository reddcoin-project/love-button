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
                key: 'stopmousedown',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mousedown'
            }
        ],
        rootkey = 'root.mousedown';


    document.addEventListener('mousedown', directive.delegate(options, rootkey), true);

});
