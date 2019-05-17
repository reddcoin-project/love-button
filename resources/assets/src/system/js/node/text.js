define('node/text', function() {

    'use strict';


    const text = (elements, text) => {
        if (!elements || !text) {
            return;
        }
        else if (!Array.isArray(elements)) {
            elements = [elements];
        }

        for (let i = 0, n = elements.length; i < n; i++) {
            if (elements[i].text !== text) {
                elements[i].textContent = text;
            }
        }
    };


    return text;

});
