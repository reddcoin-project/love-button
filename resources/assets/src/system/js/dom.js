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
