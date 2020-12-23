import { LoaderAction } from 'models/LoaderAction';


export default class GeneralParametersState {
    /**
     * Browser window width (in pixels).
     */
    public windowWidth: number = 0;

    /**
     * Indicator whether mobile mode is on or not.
     */
    public isMobileMode: boolean = process.env.VUE_ENV === 'server'
        ? false
        : window.innerWidth <= 800;

    /**
     * Indicator whether mobile mode is forced or not.
     * */
    public isForceMobile: boolean = false;

    /**
     * Indicator whether menu panel is visible or not.
     */
    public isMenuActive: boolean = false;

    /**
     * Indicator whether app is loading something.
     */
    public isLoading: boolean = false;

    /**
     * Loader message to display.
     */
    public loaderMessage: string = '';

    /**
     * Loader buttons and callbacks list.
     */
    public loaderActions: LoaderAction[] = [];

    /**
     * Loader beforeDestroy callback.
     */
    public loaderBeforeDestroy: () => any = () => { // eslint-disable-line
        this.loaderActions = [];
    };

    /**
     * Loader beforeDestroy callback.
     */
    public loaderMounted: () => any = () => undefined; // eslint-disable-line

    /**
     * Indicator whether bottom menu should be visible.
     */
    public isVisibleBottomMenu: boolean = true;
}
