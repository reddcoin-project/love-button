define('node/attribute', function() {

    'use strict';


    function removeAttributes(element, attributes) {
        if (!attributes) {
            return;
        }
        else if (!Array.isArray(attributes)) {
            attributes = [attributes];
        }

        for (let i = 0, n = attributes.length; i < n; i++) {
            let attribute = attributes[i];

            if (attribute === 'class') {
                element.className = '';
            }
            else {
                element.removeAttribute(attribute);
            }
        }
    }

    function setAttributes(element, attributes) {
        if (!attributes) {
            return;
        }

        for (let key in attributes) {
            let value = attributes[key];

            if (key === 'class') {
                element.className = value;
            }
            else if (key.slice(0, 5) === 'data-') {
                element.setAttribute(key, value);
            }
            else {
                element[key] = value;
            }
        }
    }


    const attribute = (elements, obj) => {
        if (!elements || !obj) {
            return;
        }
        else if (!Array.isArray(elements)) {
            elements = [elements];
        }

        let remove = [],
            set = {};

        for (let key in obj) {
            let value = obj[key];

            // == Checks 'null' + 'undefined'
            if (value == null || value === false || value === 'remove') {
                remove.push(key);
            }
            else {
                set[key] = value;
            }
        }

        for (let i = 0, n = elements.length; i < n; i++) {
            removeAttributes(elements[i], remove);
            setAttributes(elements[i], set);
        }
    };


    return attribute;

});
