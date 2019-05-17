/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Keydown Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                fn: directive.fn,
                key: 'keydown'
            }
        ],
        rootkey = 'root.keydown';


    document.addEventListener('keydown', directive.delegate(options, rootkey), true);

});
