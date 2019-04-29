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
