define('dom/id', {
    dependencies: ['emitter'],
    value: function(emitter) {

        'use strict';


        let ids = new Map();


        function find(key) {
            return document.getElementById(key);
        }

        function ready() {
            ids.clear();
        }


        // Flush Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const id = (key) => {
            if (!key) {
                return;
            }

            if (!ids.has(key)) {
                ids.set(key, find(key));
            }

            return ids.get(key);
        };


        return id;

    }
});
