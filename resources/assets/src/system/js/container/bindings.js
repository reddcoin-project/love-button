const bindings = (function() {

    'use strict';


    let bindings = new Map();


    function resolveAsSingleton(singleton) {
        if (typeof singleton === 'boolean' && singleton === false) {
            return false;
        }

        return true;
    }


    const get = (name) => {
        let binding = bindings.get(name);

        if (!binding) {
            console.error(`Invalid Container Binding: Namespace Not Found '${name}'`);
        }

        return binding;
    };

    const set = (name, opts) => {
        let { dependencies, singleton, value } = opts;

        // Value Is Being Provided ( Obj, Fn, Primitive )
        if (!dependencies && !singleton && !value) {
            value = opts;
        }

        dependencies = dependencies || [];
        singleton = resolveAsSingleton(singleton);

        if (!value) {
            console.error(`Invalid Container Binding: '${name}' Is Missing The Value Property`);
        }

        bindings.set(name, Object.freeze({ dependencies, singleton, value }));
    };


    return Object.freeze({ get, set });

})();
