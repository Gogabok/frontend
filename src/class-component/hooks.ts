import Component from 'vue-class-component';


/**
 * Custom hooks, that will be available in Vue components.
 */
export const supportedHooks: string[] = [
    'asyncData',
    'metaInfo',
    'beforeRouteEnter',
];

Component.registerHooks(supportedHooks);
