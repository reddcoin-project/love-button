const { define, require } = (function() {

    'use strict';


    const define = (namespace, opts) => {
        bindings.set(namespace, opts);
    };

    const require = (namespace, fn) => {
        return resolver.handle(namespace, fn);
    };


    return Object.freeze({ define, require });

}());
