import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * Profile field update status indicator logic.
 */
@Component
export default class ProfileFieldProgressIndicator extends Vue {
    /**
     * Indicator whether data is being uploaded to the server.
     */
    public isLoading: boolean = false;

    /**
     * Indicator whether edit mode is active.
     */
    public isEditMode: boolean = false;

    /**
     * Indicator whether data update succeeded.
     */
    public isSucceeded: boolean = false;

    /**
     * Sets loading mode active.
     */
    public startLoading(): void {
        this.isLoading = true;
    }

    /**
     * Sets data upload status as succeeded.
     */
    public succeed(): void {
        setTimeout(() => this.isSucceeded = false, 1600);
        this.isSucceeded = true;
        this.isLoading = false;
    }

    /**
     * Sets data upload status as failed.
     */
    public fail(): void {
        this.isLoading = false;
    }

    /**
     * Enables edit mode.
     */
    public enableEditMode(): void {
        this.isEditMode = true;
    }

    /**
     * Disabled edit mode.
     */
    public disableEditMode(): void {
        this.isEditMode = false;
    }
}
