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

/**
 *------------------------------------------------------------------------------
 *
 *  Transitions Are Disabled By Default To Prevent CSS Transition Flash Caused
 *  By Overlays
 *
 */

require(['emitter', 'node'], function(emitter, node) {

    'use strict';


    let html = document.documentElement,
        modifier = {
            overlay: 'html--overlay',
            ready: 'html--ready'
        };


    emitter.once('modules.mounted', function() {
        node.update(html, {
            classname: { [modifier.ready]: 'add' }
        });
    });


    emitter.on('overlay.activated', function() {
        node.update(html, {
            classname: { [modifier.overlay]: 'add' }
        });
    });

    emitter.on('overlay.deactivated', function() {
        node.update(html, {
            classname: { [modifier.overlay]: 'remove' }
        });
    });

});

/**
 *------------------------------------------------------------------------------
 *
 *  Activate/Deactive State Events
 *
 */

define('modules/state', {
    dependencies: ['emitter', 'node'],
    value: function(emitter, node) {

        'use strict';


        let classname = 'active';


        function shared(elements, action, state) {
            if (!elements) {
                return;
            }
            else if (!Array.isArray(elements)) {
                elements = [elements];
            }

            node.update(elements, {
                classname: { [classname]: action },

                after: () => {
                    for (let i = 0, n = elements.length; i < n; i++) {
                        let element = elements[i],
                            id = element.id;

                        if (id) {
                            emitter.dispatch(`${id}.${state}`, {}, element);
                        }
                    }
                }
            });
        }


        const active = (element) => {
            let list = element.classList;

            if (list) {
                return list.contains(classname);
            }

            return false;
        };


        const activate = (elements) => {
            shared(elements, 'add', 'activated');
        };

        const deactivate = (elements) => {
            shared(elements, 'remove', 'deactivated');
        };

        const toggle = (elements) => {
            shared(elements, 'toggle', 'toggled');
        };


        return Object.freeze({ active, activate, deactivate, toggle });

    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  Activate Element Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let attribute = 'data-activate';


    const activate = function() {
        state.activate( dom.id( this.getAttribute(attribute) ) );
    };


    directive.on('activate', activate);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Deactivate Element Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let attribute = 'data-deactivate';


    const deactivate = function() {
        state.deactivate( dom.id( this.getAttribute(attribute) ) );
    };


    directive.on('deactivate', deactivate);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Toggle State Click Event
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let active = [],
        attribute = 'data-toggle';


    const deactivate = (element) => {
        let index = active.indexOf(element);

        if (index > -1) {
            active.splice(index, 1);
        }

        state.deactivate(element);
    };

    const detoggle = (e) => {
        if (active.length === 0) {
            return;
        }

        let target = e.target;

        if (target) {
            target = dom.id( target.getAttribute(attribute) ) || target;
        }

        for (let i in active) {
            let element = active[i];

            if (element === target || element.contains(target)) {
                continue;
            }

            deactivate(element);
        }
    };

    const toggle = function(e) {
        let target = dom.id( this.getAttribute(attribute) ) || this,
            type = e.type;

        if (type === 'focus' || type === 'mouseenter') {
            type = 'activate';
        }
        else if (type === 'blur' || type === 'mouseleave') {
            type = 'deactivate';
        }
        else {
            type = 'toggle';
        }

        // 'target' Is Being Deactivated
        if (state.active(target)) {
            deactivate(target);

            if (target !== this) {
                deactivate(this);
            }
        }
        else {
            detoggle(e);

            if (target !== this) {
                active.push(this);
                state[type](this);
            }

            active.push(target);
            state[type](target);
        }
    };


    directive.on('root.click', detoggle);
    directive.on('toggle', toggle);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Set Max Height Of Accordion Element
 *
 */

require(['directive', 'dom', 'node'], function(directive, dom, node) {

    'use strict';


    let attribute = 'data-accordion',
        classname = 'accordion',
        modifier  = 'active';


    function active(element) {
        return element.classList.contains(classname) && element.style.maxHeight > '0px';
    }


    const accordion = function() {
        let target = dom.id( this.getAttribute(attribute) );

        if (!target) {
            return;
        }

        if (active(target)) {
            dom.update(() => {
                node.classname(this, { [modifier]: 'remove' });
                node.style(target, { maxHeight: '0px' });
            });
        }
        else {
            node.update(target, {
                style: {
                    maxHeight: `${target.scrollHeight}px`
                },

                before: () => {
                    node.classname(node.siblings(this).concat(node.siblings(target)), { [modifier]: 'remove' });
                    node.classname([this, target], { [modifier]: 'add' });

                    node.style(node.siblings(target, active), { maxHeight: '0px' });
                }
            });
        }
    };


    directive.on('accordion', accordion);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Trigger/Create Alert
 *
 */

define('modules/alert', {
    dependencies: ['dom', 'node', 'render', 'modules/state'],
    value: function(dom, node, render, state) {

        'use strict';


        let id = {
                alert: (key) => `alert-${key}`,
                messages:  (key) => `alert-${key}-messages`
            },
            template = (message) => `<p>${message}</p>`;


        function activate(key, values) {
            let alert = dom.id( id.alert(key) ),
                messages = dom.id( id.messages(key) );

            if (!alert || !messages || !values) {
                return;
            }

            node.update(messages, {
                html: render.template(template, values),

                after: () => {
                    state.activate(alert);
                }
            });
        }


        const error = (messages) => {
            activate('error', messages);
        };

        const info = (messages) => {
            activate('info', messages);
        };

        const success = (messages) => {
            activate('success', messages);
        };


        return Object.freeze({ error, info, success });

    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  Copy Value To Clipboard
 *
 */

require(['directive', 'dom', 'modules/alert'], function(directive, dom, alert) {

    'use strict';


    let attribute = 'data-copy';


    const copy = function() {
        let target = dom.id( this.getAttribute(attribute) );

        if (!target) {
            return;
        }

        target.select();

        document.execCommand('copy');

        alert.success("Copied!");
    };


    directive.on('copy', copy);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Drag To Scroll Horizontally
 *
 */

require(['dom', 'directive', 'emitter', 'node'], function(dom, directive, emitter, node) {

    'use strict';


    let elements = new Map();


    const drag = function(e) {
        let data = elements[this] || {};

        if (!data.mouseDown) {
            return;
        }

        e.preventDefault();

        node.update(this, {
            attribute: {
                scrollLeft: data.scrollLeft - ((e.pageX - this.offsetLeft) - data.startX)
            }
        });
    };

    const start = function(e) {
        elements[this] = {
            mouseDown: true,
            scrollLeft: this.scrollLeft,
            startX: e.pageX - this.offsetLeft
        };
    };

    const stop = function(e) {
        elements[this] = {
            mouseDown: false,
            scrollLeft: 0,
            startX: 0
        };
    };


    directive.on('drag.move',  drag);
    directive.on('drag.start', start);
    directive.on('drag.stop',  stop);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Register Drawer Directives Using Overlay Module
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    let container = {
            id: 'drawers',
            modifier: (k) => `drawers--${k}`,
            modifiers: ['grey', 'transparent']
        },
        child = {
            attribute: {
                modifier: 'data-modifier',
                trigger: 'data-drawer'
            },
            id: (k) => `drawer-${k}`,
        },
        directives = {
            close: 'drawers',
            trigger: 'drawer'
        };


    function mount() {
        require('modules/overlays')(child, container, directives);
    }


    emitter.on('modules.mount', mount);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Embed Video In Modal
 *
 */

require([
    'directive',
    'dom',
    'emitter',
    'node',
    'render'
], function(directive, dom, emitter, node, render) {

    'use strict';
 

    let classname = 'modal-embed',
        id = 'modal-embed',
        modifier = {
            pdf: 'modal-embed--pdf',
            video: 'modal-embed--video'
        },
        src = {
            pdf: '#toolbar=0',
            video: '?autoplay=1'
        },
        template = (src) => `<iframe src="${src}" frameborder="0"></iframe>`,
        timeout;


    let modal = dom.id(id),
        wrapper = modal ? modal.getElementsByClassName(classname)[0] : null;

    if (!modal || !wrapper) {
        return;
    }


    const deactivated = () => {
        node.update(wrapper, {
            html: '',

            after: () => {
                timeout = setTimeout(() => {
                    let classes = Object.values(modifier),
                        obj = {};

                    for (let c of classes) {
                        obj[c] = false;
                    }

                    node.classname(wrapper, obj);
                }, 300);
            }
        });
    };

    const embed = function() {
        let data = this.dataset;

        if (!data.src || !data.type) {
            return;
        }

        clearTimeout(timeout);

        node.update(wrapper, {
            classname: modifier[data.type],
            html: render.template(template, data.src + src[data.type] ),

            after: () => {
                directive.dispatch('modal', {}, this);
            }
        });
    };


    directive.on('embed', embed);
    emitter.on('modal-embed.deactivated', deactivated);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Autoresize Textarea On Keypress
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const autoresize = function() {
        node.update(this, {
            style: { height: `${this.scrollHeight}px` }
        });
    };


    directive.on('autoresize', autoresize);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Simplify Handling Field States
 *
 *  Modifiers Were Originally Dependent On Form Element ':focus' ':checked'
 *  Selectors To Modify States Resulting In Long Selectors Once Compiled.
 *
 *  JS Unifies States By Shifting Modifiers To Parent
 *  - Also Enables Sticking To A Unified State System Across All Modules!
 *
 */

require(['directive', 'dom', 'modules/state'], function(directive, dom, state) {

    'use strict';


    let events = {
            change: new Event('change')
        };


    const checkbox = function(e) {
        let field = this,
            tag = e.target;

        state[tag.checked ? 'activate' : 'deactivate'](field);

        if (tag.checked && tag.type === 'radio') {
            let siblings = dom.names(tag.name);

            if (!siblings) { 
                return;
            }

            for(let i = 0, n = siblings.length; i < n; i++) {
                let sibling = siblings[i];

                // Trigger Deactivation Of Unchecked Siblings
                if (tag !== sibling) {
                    sibling.dispatchEvent(events.change);
                }
            }
        }
    };


    directive.on('checkbox', checkbox);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Show/Hide Password
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const password = function() {
        let input = this.nextElementSibling;

        node.update(input, {
            attribute: { type: input.type === 'password' ? 'text' : 'password' }
        });
    };


    directive.on('password', password);

});

/**
 *------------------------------------------------------------------------------
 *
 *  On Select Change Update Mask
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const select = function(e) {
        let mask = this.firstElementChild,
            tag = e.target;

        node.update(mask, {
            text: tag.options[tag.selectedIndex].text
        });
    };


    directive.on('select', select);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Change File Name On Upload
 *
 */

require(['directive', 'node'], function(directive, node) {

    'use strict';


    const upload = function() {
        let mask = this.nextElementSibling;

        node.update(mask, {
            text: this.files[0].name
        });
    };


    directive.on('upload', upload);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Register Modals Directives Using Overlay Module
 *
 */

require(['emitter'], function(emitter) {

    'use strict';


    let container = {
            id: 'modals',
            modifier: (k) => `modals--${k}`,
            modifiers: []
        },
        child = {
            attribute: {
                modifier: 'data-modifier',
                trigger: 'data-modal'
            },
            id: (k) => `modal-${k}`,
        },
        directives = {
            close: 'modals',
            trigger: 'modal'
        };


    function mount() {
        require('modules/overlays')(child, container, directives);
    }


    emitter.on('modules.mount', mount);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Reusable Overlay Functionality ( Menus, Modals )
 *
 *  container
 *      id              Overlay Container Id ( str )
 *      modifier        Create Modifier Classname Using Value Provided
 *                      By 'child.attribute.modifier' ( fn )
 *      modifiers       Modifiers Applied To Overlay During Activation  ( arr )
 *  child
 *      attribute
 *          modifier    Prefix-less Modifier To Add On Overlay Container ( str )
 *          trigger     Contains Value To Generate Id ( str )
 *      id              Create Child Id Using Value Provided By Trigger ( fn )
 *  directives
 *      close           Close Overlay + Children ( str )
 *      trigger         Trigger Opening/Closing An Overlay Child ( str )
 *
 */

define('modules/overlays', {
    dependencies: ['directive', 'dom', 'emitter', 'node', 'modules/state'],
    value: function(directive, dom, emitter, node, state) {

        'use strict';


        // Dispatch Shared Functions
        function shared(activate, deactivate, dispatch) {
            state.activate(activate);
            state.deactivate(deactivate);

            emitter.dispatch(`overlay.${dispatch}`);
        }


        const register = (child, container, directives) => {
            container.node = dom.id(container.id);

            if (!container.node) {
                return;
            }


            function activate(target) {
                let attribute = target.getAttribute(child.attribute.modifier),
                    modifier = attribute ? container.modifier( attribute ) : null;

                if (modifier && !container.modifiers.includes(modifier)) {
                    node.update(container.node, {
                        classname: {
                            [modifier]: 'add',
                            [container.modifiers]: 'remove'
                        },

                        after: () => {
                            container.modifiers = [modifier];
                        }
                    });
                }

                shared([container.node, target], node.siblings(target, (s) => state.active(s)), 'activated');
            }

            function deactivate() {
                let children = container.node.children,
                    deactivate = [];

                for (let i = 0, n = children.length; i < n; i++) {
                    let child = children[i];

                    if (state.active(child)) {
                        deactivate.push(child);
                    }
                }

                shared([], deactivate.concat([container.node]), 'deactivated');

                // Let Closing CSS Animation Finish Before Removing Modifiers
                setTimeout(() => {
                    node.update(container.node, {
                        classname: {
                            [container.modifiers]: 'remove'
                        },

                        after: () => {
                            container.modifiers = [];
                        }
                    });
                }, 500);
            }


            const close = () => {
                if (!state.active(container.node)) {
                    return;
                }

                deactivate();
            };

            const trigger = function() {
                let id = child.id( this.getAttribute(child.attribute.trigger) ),
                    target = dom.id(id);

                if (target && !state.active(target)) {
                    activate(target);
                }
                else {
                    close();
                }
            };


            directive.on(directives.close, close);
            directive.on(directives.trigger, trigger);
        };


        return register;

    }
});

/**
 *------------------------------------------------------------------------------
 *
 *  Scrollbar Replacement
 *
 */

require(['dom', 'directive', 'emitter', 'node'], function(dom, directive, emitter, node) {

    'use strict';


    let attribute = 'data-scrollbar',
        modifier = 'scrollbar--hidden',
        ref = 'scrollbar';

    let scrolling = false,
        scrollbarWidth = null;


    const mount = () => {
        let containers = dom.refs(ref);

        for (let i = 0, n = containers.length; i < n; i++) {
            let container = containers[i];

            if (scrollbarWidth === null) {
                scrollbarWidth = container.offsetWidth - container.clientWidth;
            }

            directive.dispatch('scrollbar', {}, container);

            if (scrollbarWidth !== 17) {
                node.update(container, {
                    style: {
                        'width': `calc(100% + ${scrollbarWidth}px)`
                    }
                });
            }

            // Override To Set Height Of All Scrollbars
            scrolling = false;
        }
    };

    const scroll = function() {
        let scrollbar = dom.id( this.getAttribute(attribute) );

        if (scrolling || !scrollbar) {
            return;
        }

        let height = (this.clientHeight / this.scrollHeight) * 100,
            translate = `translate3d(0, ${(this.scrollTop / this.clientHeight) * 100}%, 0)`;

        scrolling = true;

        node.update(scrollbar, {
            classname: {
                [modifier]: height >= 100
            },
            style: {
                '-webkit-transform': translate,
                '-ms-transform': translate,
                'transform': translate,
                'height': `${height}%`
            },

            after: () => {
                scrolling = false;
            }
        });
    };


    directive.on('scrollbar', scroll);
    emitter.on('modules.mount', mount);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Horizontal Scrolling Using Scroll Wheel
 *
 */

require(['dom', 'directive', 'emitter', 'node'], function(dom, directive, emitter, node) {

    'use strict';


    let ref = 'scroller',
        multiplier = 32;


    const mount = () => {
        let scrollers = dom.refs(ref);

        for (let i = 0, n = scrollers.length; i < n; i++) {
            let scroller = scrollers[i];

            let css = window.getComputedStyle(scroller.parentNode),
                height = parseInt(scroller.firstElementChild.clientHeight || 0)
                       + parseInt(css.paddingTop)
                       + parseInt(css.paddingBottom);

            node.update(scroller.parentNode, {
                style: { height: `${height}px` }
            });
        }
    };

    const wheel = function(e) {
        // Scroll Up
        if ((- e.deltaY / 3) === 1) {
            if (this.scrollLeft < 1) {
                return;
            }
        }
        // Scroll Down
        else {
            if (this.scrollLeft >= this.scrollLeftMax) {
                return;
            }
        }

        e.preventDefault();
        e.stopPropagation();

        node.update(this, {
            attribute: {
                scrollLeft: this.scrollLeft - (Math.max(-1, Math.min(1, (- e.deltaY / 3))) * multiplier)
            }
        });
    };


    directive.on('scroller', wheel);
    emitter.on('modules.mount', mount);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Scroll To Element On Page
 *
 */

require(['directive', 'dom'], function(directive, dom) {

    'use strict';


    let attribute = 'data-scrollto',
        container = dom.id('site'),
        id = (k) => `scrollto-${k}`;

    if (!container) {
        return;
    }

    let maxScroll = container.scrollHeight - container.clientHeight,
        offset = 0;


    function getOffsetTop(element) {
        let distance = 0;

        if (element.offsetParent) {
            do {
                distance += element.offsetTop;
                element   = element.offsetParent;
            } while (element);
        }

        return (distance < 0) ? 0 : distance;
    }

    function scroll() {
        let difference = offset - container.scrollTop,
            shift = 100;

        if (Math.abs(difference) < shift) {
            shift = Math.abs(difference);
        }

        if (container.scrollTop < maxScroll) {
            if (difference > 0) {
                container.scrollTop += shift;
            }
            else if (difference < 0) {
                container.scrollTop -= shift;
            }

            if (difference !== 0) {
                setTimeout(scroll, 1);
            }
        }
    }


    const scrollTo = function(e) {
        let target = dom.id( id(this.getAttribute(attribute)) );

        if (!target) {
            return;
        }

        e.preventDefault();

        offset = getOffsetTop(target);

        setTimeout(scroll, 1);
    };


    directive.on('scrollto', scrollTo);

});

/**
 *------------------------------------------------------------------------------
 *
 *  Activate/Deactivate Frames
 *
 */

require(['directive', 'dom', 'node', 'modules/state'], function(directive, dom, node, state) {

    'use strict';


    let attribute = 'data-frame',
        id = (k) => `frame-${k}`;


    const frame = function() {
        let target = dom.id( id(this.getAttribute(attribute)) ),
            trigger = this;

        if (!target) {
            target = dom.id(this.getAttribute(attribute));

            if (!target) {
                return;
            }
        }

        if (!state.active(target)) {
            state.deactivate(node.siblings(trigger).concat(node.siblings(target)));
            state.activate([trigger, target]);
        }
    };


    directive.on('frame', frame);

});
