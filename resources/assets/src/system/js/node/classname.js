define('node/classname', function() {

    'use strict';


    function classlist(classes, names) {
        let type = typeof names;

        if ((type === "string" || type === "number") && !classes.includes(names)) {
            classes.push(names);
        }
        else if (Array.isArray(names)) {
            for (let i = 0, n = names.length; i < n; i++) {
                classes = classlist(classes, names[i]);
            }
        }
        else if (type === 'object') {
            for (let key in names) {
                let action = names[key];

                if (!action || action === 'remove') {
                    let index = classes.indexOf(key);

                    if (index > -1) {
                        classes.splice(index, 1);
                    }
                }
                else {
                    if (action === 'toggle') {
                        key = classes.includes(key) ? { [key]: 'remove' } : key;
                    }

                    // Default Action Will Add Key Unless Overridden By Toggle ^
                    classes = classlist(classes, key);
                }
            }
        }

        return classes;
    }


    const classname = (elements, names) => {
        if (!elements || !names) {
            return;
        }
        else if (!Array.isArray(elements)) {
            elements = [elements];
        }

        for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];

            let current = element.className,
                updated = classlist(current.split(' '), names).join(' ');

            if (current !== updated) {
                element.className = updated;
            }
        }
    };


    return classname;

});
