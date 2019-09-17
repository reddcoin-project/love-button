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
