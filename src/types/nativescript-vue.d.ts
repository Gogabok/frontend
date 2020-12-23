declare module 'nativescript-vue' {
    import Vue from 'vue';

    /**
     * Create a NativeScript vue class that extends vue.js.
     */
    class NativeScriptVue extends Vue {

        /**
         * Is app running on Android.
         */
        public $isAndroid: boolean;

        /**
         * Registers NativeScript Plugin.
         *
         * @param elementName   Name of the element to use in your template.
         * @param resolver      Function that returns the plugin.
         */
        static registerElement(elementName: string, resolver: () => void): void;
    }

    export = NativeScriptVue;
}
