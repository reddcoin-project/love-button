define('dom/refs', {
    dependencies: ['emitter', 'node'],
    value: function(emitter, node) {

        'use strict';


        let key = 'data-ref',
            refs = new Map();


        function cache(elements) {
            for (let i = 0, n = elements.length; i < n; i++) {
                let element = elements[i],
                    value = element.getAttribute(key);

                if (!value) {
                    continue;
                }

                if (!refs.has(value)) {
                    refs.set(value, []);
                }

                refs.get(value).push(element);
            }

            node.update(elements, {
                attribute: { [key]: false }
            });
        }

        function find() {
            return Array.from( document.querySelectorAll(`[${key}]`) || [] );
        }

        function ready() {
            refs.clear();
            cache(find());

            emitter.dispatch('dom.refs.cached');
        }


        // Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const ref = (id) => {
            let ref = refs.get(id) || [];

            refs.delete(id);

            return ref;
        };


        return ref;

    }
});
