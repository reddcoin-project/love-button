define('dom/names', {
    dependencies: ['emitter'],
    value: function(emitter) {

        'use strict';


        let names = new Map();


        function find(key) {
            return Array.from( document.getElementsByName(key) || [] );
        }

        function ready() {
            names.clear();
        }


        // Flush Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const name = (key) => {
            if (!key) {
                return;
            }

            if (!names.has(key)) {
                names.set(key, find(key));
            }

            return names.get(key) || [];
        };


        return name;

    }
});
