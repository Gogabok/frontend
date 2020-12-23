import Vue, { ComponentOptions } from 'vue';

import Clipboard from 'plugins/Clipboard';
import Touch from 'plugins/Touch';
import Validation from 'plugins/Validation';

import App from 'components/app/web/App.vue';

import store from 'store';

import 'filters';


if (process.browser || process.env.NODE_ENV === 'test') {
    Clipboard.init();
    Touch.init();
    Validation.init();
}

/**
 * Initial app params, that can be used for initializing Vue app instance in
 * all environments: client, server, test.
 */
export const params: ComponentOptions<Vue> = {
    render: (h) => h(App),
    store,
};

export default params;
