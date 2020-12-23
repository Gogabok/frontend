import Vue from 'vue';


declare module 'vue/types/vue' {
    interface Vue {

        /**
         * Meta information of page component.
         */
        $meta(): any, // eslint-disable-line

        /**
         * Calls the NativeScript application.start() method.
         */
        $start(): void;

        /**
         * Manual routing in the mobile app.
         * Go to component, passed like param `component`.
         *
         * @param component   Vuejs component.
         * @param options     Routing options object.
         */
        $navigateTo(
            component: typeof Vue,
            options?: { [key: string]: any }, // eslint-disable-line
        ): void;

        /**
         * Manual routing in the mobile app.
         * Go to prev mobile page.
         */
        $navigateBack(): void;
    }
}
