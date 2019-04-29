/**
 *------------------------------------------------------------------------------
 *
 *  Mount Modules Once DOM Is Ready
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    function mount() {

        // Add 'mounted' To The End Of The Modules Mount Loop
        emitter.once('modules.mount', () => {
            emitter.dispatch('modules.mounted');
        }); 

        emitter.dispatch('modules.mount');
    }


    emitter.on('dom.refs.cached', mount);

});
