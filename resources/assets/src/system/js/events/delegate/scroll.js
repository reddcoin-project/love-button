/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Scroll Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopscroll',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'scroll'
            }
        ],
        rootkey = 'root.scroll';


    document.addEventListener('scroll', directive.delegate(options, rootkey), { passive: true, capture: true });

});
