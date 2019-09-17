/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Wheel Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopwheel',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'wheel'
            }
        ],
        rootkey = 'root.wheel';


    document.addEventListener('wheel', directive.delegate(options, rootkey), true);

});
