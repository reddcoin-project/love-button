const resolver = (function() {

    'use strict';


    let resolved = new Map();


    function build(dependencies, fn) {
        if (!dependencies) {
            return fn();
        }
        else if (!Array.isArray(dependencies)) {
            dependencies = [dependencies];
        }

        let values = [];

        for (let i = 0, n = dependencies.length; i < n; i++) {
            values.push(handle(dependencies[i]));
        }

        return fn(...values);
    }

    function resolve(namespace, binding) {
        let { dependencies, singleton, value } = binding;

        if (typeof value === 'function') {
            value = build(dependencies, value);
        }

        if (singleton) {
            resolved.set(namespace, value);
        }

        return value;
    }


    const handle = (namespace, fn) => {
        if (fn) {
            return build(namespace, fn);
        }
        else if (typeof namespace === 'string' && resolved.has(namespace)) {
            return resolved.get(namespace);
        }

        return resolve(namespace, bindings.get(namespace));
    };


    return Object.freeze({ handle });

})();
