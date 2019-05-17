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
                key: 'stopmousemove',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mousemove'
            }
        ],
        rootkey = 'root.mousemove';


    document.addEventListener('mousemove', directive.delegate(options, rootkey), true);

});
