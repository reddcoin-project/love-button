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

const resolver = (function() {

    'use strict';


    let resolved = new Map();


    function build(dependencies, fn) {
        if (!dependencies) {
            return fn();
        }
        else if (!Array.isArray(dependencies)) {
            dependencies = [dependencies];
        }

        let values = [];

        for (let i = 0, n = dependencies.length; i < n; i++) {
            values.push(handle(dependencies[i]));
        }

        return fn(...values);
    }

    function resolve(namespace, binding) {
        let { dependencies, singleton, value } = binding;

        if (typeof value === 'function') {
            value = build(dependencies, value);
        }

        if (singleton) {
            resolved.set(namespace, value);
        }

        return value;
    }


    const handle = (namespace, fn) => {
        if (fn) {
            return build(namespace, fn);
        }
        else if (typeof namespace === 'string' && resolved.has(namespace)) {
            return resolved.get(namespace);
        }

        return resolve(namespace, bindings.get(namespace));
    };


    return Object.freeze({ handle });

})();

define('dom/id', {
    dependencies: ['emitter'],
    value: function(emitter) {

        'use strict';


        let ids = new Map();


        function find(key) {
            return document.getElementById(key);
        }

        function ready() {
            ids.clear();
        }


        // Flush Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const id = (key) => {
            if (!key) {
                return;
            }

            if (!ids.has(key)) {
                ids.set(key, find(key));
            }

            return ids.get(key);
        };


        return id;

    }
});

define('dom/names', {
    dependencies: ['emitter'],
    value: function(emitter) {

        'use strict';


        let names = new Map();


        function find(key) {
            return Array.from( document.getElementsByName(key) || [] );
        }

        function ready() {
            names.clear();
        }


        // Flush Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const name = (key) => {
            if (!key) {
                return;
            }

            if (!names.has(key)) {
                names.set(key, find(key));
            }

            return names.get(key) || [];
        };


        return name;

    }
});

define('dom/refs', {
    dependencies: ['emitter', 'node'],
    value: function(emitter, node) {

        'use strict';


        let key = 'data-ref',
            refs = new Map();


        function cache(elements) {
            for (let i = 0, n = elements.length; i < n; i++) {
                let element = elements[i],
                    value = element.getAttribute(key);

                if (!value) {
                    continue;
                }

                if (!refs.has(value)) {
                    refs.set(value, []);
                }

                refs.get(value).push(element);
            }

            node.update(elements, {
                attribute: { [key]: false }
            });
        }

        function find() {
            return Array.from( document.querySelectorAll(`[${key}]`) || [] );
        }

        function ready() {
            refs.clear();
            cache(find());

            emitter.dispatch('dom.refs.cached');
        }


        // Cache On DOM Ready ( Necessary For Tags )
        emitter.on('dom.ready', ready);


        const ref = (id) => {
            let ref = refs.get(id) || [];

            refs.delete(id);

            return ref;
        };


        return ref;

    }
});

define('dom/update', function() {

    'use strict';


    let raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) {
            return window.setTimeout(fn, 1000 / 60);
        };

    let running = false,
        stack = [];


    function frame() {
        running = true;

        let task;

        while (task = stack.shift()) {
            task();
        }

        running = false;
    }


    // Add Function To Stack -> Schedule DOM Update
    const update = (fn) => {
        if (typeof fn !== 'function') {
            return;
        }

        stack.push(fn);

        if (!running) {
            raf(frame);
        }
    };


    return update;

});

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

define('node/html', function() {

    'use strict';


    let methods = { append, inner, prepend };


    function append(element, html) {
        element.appendChild(child);
    }

    function inner(element, html) {
        let child;

        while (child = element.firstChild) {
            element.removeChild(child);
        }

        if (html) {
            element.appendChild(html);
        }
    }

    function prepend(element, html) {
        element.insertBefore(html, element.firstElementChild);
    }


    const html = (elements, obj) => {
        if (!elements) {
            return;
        }
        else if (!Array.isArray(elements)) {
            elements = [elements];
        }

        let directions = typeof obj === 'object' && !obj.ownerDocument;

        for (let i = 0, n = elements.length; i < n; i++) {
            // 'obj' Contains Method Key/Directions
            if (directions) {
                for (let key in obj) {
                    let method = methods[key];

                    if (!method) {
                        continue;
                    }

                    method(elements[i], obj[key]);
                }
            }
            // 'obj' Should Be HTML; Use Default Option 'innerHTML'
            else {
                inner(elements[i], obj);
            }
        }
    };


    return html;

});

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

define('node/style', function() {

    'use strict';


    const style = (elements, style) => {
        if (!elements || !style) {
            return;
        }
        else if (!Array.isArray(elements)) {
            elements = [elements];
        }

        for (let i = 0, n = elements.length; i < n; i++) {
            let assign = {},
                current = elements[i].style;

            for (let key in style) {
                if (current[key] === style[key]) {
                    continue;
                }

                assign[key] = style[key];
            }

            if (Object.keys(assign).length) {
                Object.assign(current, assign);
            }
        }
    };


    return style;

});

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

define('render/html', function() {

    'use strict';


    let parser = new DOMParser();


    function createFragment() {
        return document.createDocumentFragment();
    }


    const html = (string) => {
        let children = Array.from( parser.parseFromString(string, 'text/html').body.children ),
            fragment = createFragment();

        for (let i = 0, n = children.length; i < n; i++) {
            fragment.append(children[i]);
        }

        return fragment;
    };


    return html;

});

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

/**
 *------------------------------------------------------------------------------
 *
 *  DOM Utilities
 *
 */

define('dom', {
    dependencies: ['dom/id', 'dom/names', 'dom/refs', 'dom/update'],
    value: function(id, names, refs, update) {
        return Object.freeze({ id, names, refs, update });
    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  Application/Internal Event Emitter
 *
 *  Used For Internal Communication/Events That Are Not Accessible By DOM
 *  Directives/Delegated Events
 *
 */

define('emitter', {
    dependencies: ['pubsub'],
    value: function(self) {
        return self;
    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  DOM Node Utilities
 *
 */

define('node', {
    dependencies: [
        'node/attribute',
        'node/classname',
        'node/html',
        'node/siblings',
        'node/style',
        'node/text',
        'node/update'
    ],
    value: function(attribute, classname, html, siblings, style, text, update) {
        return Object.freeze({ attribute, classname, html, siblings, style, text, update });
    }
});

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

/**
 *------------------------------------------------------------------------------
 *
 *  Render HTML Elements From String/Templates
 *
 */

define('render', {
    dependencies: ['render/html', 'render/template'],
    value: function(html, template) {
        return Object.freeze({ html, template });
    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Blur Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopblur',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'blur'
            },
            {
                fn: directive.fn,
                key: 'focusinout'
            }
        ],
        rootkey = 'root.blur';


    document.addEventListener('blur', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Change Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopchange',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'change'
            }
        ],
        rootkey = 'root.change';


    document.addEventListener('change', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopclick',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'click'
            }
        ],
        rootkey = 'root.click';


    document.addEventListener('click', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Focus Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopfocus',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'focus'
            },
            {
                fn: directive.fn,
                key: 'focusinout'
            }
        ],
        rootkey = 'root.focus';


    document.addEventListener('focus', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Hover Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stophover',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'hover'
            }
        ],
        rootkey = 'root.hover';


    document.addEventListener('mouseenter', directive.delegate(options, rootkey), true);
    document.addEventListener('mouseleave', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Keydown Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                fn: directive.fn,
                key: 'keydown'
            }
        ],
        rootkey = 'root.keydown';


    document.addEventListener('keydown', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopmousedown',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mousedown'
            }
        ],
        rootkey = 'root.mousedown';


    document.addEventListener('mousedown', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopmouseleave',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mouseleave'
            }
        ],
        rootkey = 'root.mouseleave';


    document.addEventListener('mouseleave', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopmousemove',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mousemove'
            }
        ],
        rootkey = 'root.mousemove';


    document.addEventListener('mousemove', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Click Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopmouseup',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'mouseup'
            }
        ],
        rootkey = 'root.mouseup';


    document.addEventListener('mouseup', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Scroll Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopscroll',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'scroll'
            }
        ],
        rootkey = 'root.scroll';


    document.addEventListener('scroll', directive.delegate(options, rootkey), { passive: true, capture: true });

});

/**
 *------------------------------------------------------------------------------
 *
 *  Delegate Wheel Events Using 'data-*' Attributes + Directive PubSub System
 *
 */

require(['directive'], function(directive) {

    'use strict';


    let options = [
            {
                key: 'stopwheel',
                stop: true
            },
            {
                fn: directive.fn,
                key: 'wheel'
            }
        ],
        rootkey = 'root.wheel';


    document.addEventListener('wheel', directive.delegate(options, rootkey), true);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Mount Modules Once DOM Is Ready
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    function mount() {

        // Add 'mounted' To The End Of The Modules Mount Loop
        emitter.once('modules.mount', () => {
            emitter.dispatch('modules.mounted');
        }); 

        emitter.dispatch('modules.mount');
    }


    emitter.on('dom.refs.cached', mount);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Dispatch DOM Ready Event
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    function ready() {
        emitter.dispatch('dom.ready');
    }


    document.addEventListener('DOMContentLoaded', ready);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Trigger Delegated DOM Events On Mounted
 *
 */

require(['dom', 'emitter', 'node'], function(dom, emitter, node) {

    'use strict';


    let events = [
            'blur',
            'change',
            'click',
            'focus',
            'hover',
            'keydown',
            'scroll',
            'wheel'
        ],
        prefix = 'trigger:';


    function dispatch(elements, type) {
        let e = new Event(type);

        for (let i = 0, n = elements.length; i < n; i++) {
            elements[i].dispatchEvent(e);
        }
    }

    function mounted() {
        for (let i = 0, n = events.length; i < n; i++) {
            let elements = dom.refs(`${prefix}${events[i]}`),
                type = events[i];

            if (elements) {
                dispatch(elements, type);
            }
        }
    }


    emitter.on('modules.mounted', mounted);

});
