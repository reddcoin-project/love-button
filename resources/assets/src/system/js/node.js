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
