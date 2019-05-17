define('node/siblings', function() {

    'use strict';


    const siblings = (element, filter) => {
        let filtered = [],
            siblings = Array.from(element.parentNode.children);

        siblings.splice(siblings.indexOf(element), 1);

        if (filter) {
            for (let i = 0, n = siblings.length; i < n; i++) {
                let sibling = siblings[i],
                    valid = filter(sibling);

                if (valid) {
                    filtered.push(sibling);
                }
            }
        }

        return filter ? filtered : siblings;
    };


    return siblings;

});
