define('render/template', {
    dependencies: ['render/html'],
    value: function(html) {

        'use strict';


        const template = (fn, values) => {
            let string = '';

            if (typeof fn !== 'function' || !values) {
                return;
            }

            if (!Array.isArray(values)) {
                values = [values];
            }

            for (let i = 0, n = values.length; i < n; i++) {
                string += fn(values[i]) || '';
            }

            return html(string);
        };


        return template;

    }
});
