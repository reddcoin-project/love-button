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
