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
