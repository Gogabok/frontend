import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import Modernizr from 'plugins/Modernizr';

import ComponentNames from 'models/old/ComponentNames';


/**
 * Default page layout.
 */
@Component
export default class DefaultPage extends Vue {
    /**
     * Name of component. Used to identify component after minifying.
     */
    public readonly componentName = ComponentNames.DEFAULT_PAGE;

    /**
     * Indicator whether page is opened in sidebar or not.
     */
    @Prop({ default: false })
    public sidebar: boolean;

    /**
     * Indicator whether it's needed to show side panel.
     */
    @Prop({ default: true })
    public showSidePanel: boolean;

    /**
     * Indicator whether it's needed to show avatar editor window.
     */
    public isAvatarEditorShow: boolean = false;

    /**
     * Sets avatar editor active state.
     */
    public setIsAvatarEditorShow(isActive: boolean): void {
        console.log(isActive);
    }

    /**
     * Detects is client use mobile device or not.
     *
     * @returns                         `true` if client use mobile device,
     *                                  `false` otherwise
     */
    public get isMobileDevice(): boolean {
        return Modernizr.isMobileDevice();
    }
}
