/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Hover Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stophover',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'hover'
            }
        ],
        rootkey = 'root.hover';


    document.addEventListener('mouseenter', directive.delegate(options, rootkey), true);
    document.addEventListener('mouseleave', directive.delegate(options, rootkey), true);

});
