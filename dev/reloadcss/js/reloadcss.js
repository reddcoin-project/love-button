/**
 *--------------------------------------------------------------------------
 *
 *  Frontend Development Helper
 *
 *  Displays Browser Dimensions, And Reloads CSS On Button Press
 *
 */

(function( window, document ) {

    'use strict';


    let development = document.createElement('div');

 
    development.innerHTML = `
        <span class='reloadcss-dimensions'>${window.innerWidth} x ${window.innerHeight}</span>
        <span class='reloadcss-reloadcss'>R</span>
    `;
    development.className = 'reloadcss';

    document.body.prepend(development);


    let dimensions = document.getElementsByClassName('reloadcss-dimensions')[0] || null,
        reload = document.getElementsByClassName('reloadcss-reloadcss')[0] || null,
        stylesheet = document.getElementById('stylesheet');


    if (!dimensions || !reload || !stylesheet) {
        console.log({ dimensions, reload, stylesheet });
        return;
    }


    reload.addEventListener('click', () => {
        stylesheet.setAttribute('href', `${stylesheet.getAttribute('href').split('?')[0]}?js=${Math.random( 0, 10000 )}`);
    });


    window.addEventListener('resize', () => {
        dimensions.textContent = `${window.innerWidth} x ${window.innerHeight}`;
    });

})( window, document );
