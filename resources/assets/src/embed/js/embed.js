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
