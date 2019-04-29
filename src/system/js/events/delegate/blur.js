/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Blur Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopblur',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'blur'
            },
            {
                fn: directive.fn,
                key: 'focusinout'
            }
        ],
        rootkey = 'root.blur';


    document.addEventListener('blur', directive.delegate(options, rootkey), true);

});
