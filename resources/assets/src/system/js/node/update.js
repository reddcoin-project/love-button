define('node/update', {
    dependencies: [
        'dom/update',
        'node/attribute',
        'node/classname',
        'node/html',
        'node/style',
        'node/text'
    ],
    value: function(update, attribute, classname, html, style, text) {

        'use strict';


        let methods = { attribute, classname, html, style, text };


        const dispatch = (elements, obj) => {
            if (!elements || !obj) {
                return;
            }
            else if (!Array.isArray(elements)) {
                elements = [elements];
            }

            update(() => {
                if (obj.before) {
                    obj.before();
                }

                for (let i = 0, n = elements.length; i < n; i++) {
                    for (let key in obj) {
                        let method = methods[key];

                        if (!method) {
                            continue;
                        }

                        method(elements[i], obj[key]);
                    }
                }

                if (obj.after) {
                    obj.after();
                }
            });
        };


        return dispatch;

    }
});
