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
                key: 'stopmouseleave',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mouseleave'
            }
        ],
        rootkey = 'root.mouseleave';


    document.addEventListener('mouseleave', directive.delegate(options, rootkey), true);

});
