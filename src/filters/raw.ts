import Vue from 'vue';
import xssEscape from 'xss-escape';


Vue.filter('raw', (value: string) => {
    // eslint-disable-next-line no-control-regex
    return xssEscape(value).replace(new RegExp('\r?\n','g'), '<br/>');
});
