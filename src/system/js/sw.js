/**
 *------------------------------------------------------------------------------
 *
 *  Register Service Worker
 *  - 'sw.js' Must Be In Root!
 *
 */

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
}
