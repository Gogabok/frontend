import Vue, { PluginObject } from 'vue';

import { WebpackAsyncModuleLoader } from 'utils/WebpackAsyncLoader';


const VTooltipImport = () => import('v-tooltip');

/**
 * Configuration of v-tooltip plugin.
 */
export default class Tooltip {

    /**
     * Initializes v-tooltip plugin.
     */
    public static init(): void {
        WebpackAsyncModuleLoader(VTooltipImport)().then((VTooltip) => {
            Vue.use(VTooltip as unknown as PluginObject<unknown>);
        });
    }

}
