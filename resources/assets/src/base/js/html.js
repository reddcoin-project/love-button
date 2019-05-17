/**
 *------------------------------------------------------------------------------
 *
 *  Transitions Are Disabled By Default To Prevent CSS Transition Flash Caused
 *  By Overlays
 *
 */

require(['emitter', 'node'], function(emitter, node) {

    'use strict';


    let html = document.documentElement,
        modifier = {
            overlay: 'html--overlay',
            ready: 'html--ready'
        };


    emitter.once('modules.mounted', function() {
        node.update(html, {
            classname: { [modifier.ready]: 'add' }
        });
    });


    emitter.on('overlay.activated', function() {
        node.update(html, {
            classname: { [modifier.overlay]: 'add' }
        });
    });

    emitter.on('overlay.deactivated', function() {
        node.update(html, {
            classname: { [modifier.overlay]: 'remove' }
        });
    });

});
