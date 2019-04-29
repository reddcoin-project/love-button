/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Focus Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopfocus',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'focus'
            },
            {
                fn: directive.fn,
                key: 'focusinout'
            }
        ],
        rootkey = 'root.focus';


    document.addEventListener('focus', directive.delegate(options, rootkey), true);

});
