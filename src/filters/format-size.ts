import Vue from 'vue';


/**
 * Vue filter to format output of the file size.
 */
Vue.filter('formatSize', (value: number) => {
    let unit = 'KB';
    let result: string = value.toString();

    if (value >= 1000) {
        result = (value / 1024).toPrecision(2);
        unit = 'MB';
    }

    return `${result} ${unit}`;
});
