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
