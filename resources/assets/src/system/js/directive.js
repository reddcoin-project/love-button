/**
 *------------------------------------------------------------------------------
 *
 *  Provides Listener Function To Process Data Attribute On Delegated Events
 *
 */

define('directive', {
    dependencies: ['pubsub'],
    value: function(self) {

        'use strict';


        // Returns Event Listener For Delegated Events
        const delegate = (options, rootkey) => {
            if (!Array.isArray(options)) {
                options = [options];
            }

            return function(e) {
                let element = e.target,
                    keys;

                while (element) {
                    keys = element.dataset;

                    if (keys) {
                        keys = Object.keys(keys);

                        for (let i = 0, n = options.length; i < n; i++) {
                            let { fn, key, stop } = options[i];

                            if (!keys.includes(key)) {
                                continue;
                            }

                            if (fn) {
                                fn(element.dataset[key], e, element);
                            }

                            if (stop === true) {
                                return;
                            }
                        }
                    }

                    element = element.parentNode;
                }

                // Delegated Event Bubbled Up To Root Element
                self.dispatch(rootkey, e);
            };
        };

        // Common Function Used By Delegated Events
        const fn = (value, e, element) => {
            self.dispatch(value, e, element);
        };


        return Object.freeze(Object.assign({ delegate, fn }, self));

    }
});
