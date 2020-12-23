import Vue from 'vue';


/**
 * Truncate string if it longer then maximum allowed length.
 * To truncated string will be added  dots to end(like `lorem ipsu...`).
 * Default maximum allowed length is 15 chars.
 */
Vue.filter('truncate', (value, length) => {
    length = length || 15;
    if (!value
        || typeof value !== 'string'
        || value.length <= length
    ) {
        return value;
    }
    return value.substring(0, length) + '...';
});
