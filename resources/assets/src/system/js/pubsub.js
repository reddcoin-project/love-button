/**
 *------------------------------------------------------------------------------
 *
 *  Reusable Event/PubSub System
 *
 */

define('pubsub', {
    singleton: false,
    value: function() {

        'use strict';


        let events = new Map();


        const dispatch = (key, data, context) => {
            if (!events.has(key)) {
                return;
            }

            let queue = events.get(key);

            queue.forEach((fn) => {
                (context ? fn.bind(context) : fn)(data);

                if (fn.__once) {
                    queue.delete(fn);
                }
            });
        };

        const off = (key, fn) => {
            if (typeof fn !== 'function') {
                return;
            }

            if (fn) {
                events.get(key).delete(fn);
            }
            else {
                events.delete(key);
            }
        };

        const on = (key, fn) => {
            if (typeof fn !== 'function') {
                return;
            }

            if (!events.has(key)) {
                events.set(key, new Set());
            }

            events.get(key).add(fn);
        };

        const once = (key, fn) => {
            fn.__once = true;

            on(key, fn);
        };


        return Object.freeze({ dispatch, off, on, once });

    }
});
