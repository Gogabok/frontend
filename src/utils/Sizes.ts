/**
 * Set of all available screens and elements sizes, used in the project.
 */
export default class Sizes {

    /**
     * Sizes of the quick access sidebar.
     */
    public static readonly quickAccessSidebar = {
        width: 331,
    };

    /**
     * Sizes of the menu sidebar.
     */
    public static readonly menuSidebar = {
        avatar: {
            width: 100,
        },
        width: 331,
    };

    /**
     * Sizes of the page header.
     */
    public static readonly header = {
        height: 37,
    };

    /**
     * Sizes of the page footer.
     */
    public static readonly footer = {
        height: 27,
    };

    /**
     * Sizes of the page main container.
     */
    public static readonly main = {
        margin: {
            hz: 20,
        },
    };

    /**
     * Sizes of the page wrapper.
     */
    public static readonly wrapper = {
        width: 1366,
    };

    /**
     * List of screen sizes, supported by application.
     */
    public static readonly screen = {
        desktop: {
            big: {
                height: 1050,
                width: 1680,
            },
            s: {
                height: 1000,
                width: 1000,
            },
            xs: {
                height: 800,
                width: 800,
            },
        },
        mobile: {
            height: 480,
            width: 756,
        },
        smallTablets: {
            width: 875,
        },
    };

    /**
     * Main sizes of page: page width, font size etc.
     */
    public static page = {
        font: {
            size: {
                big: 14,
                medium: 13,
                xSmall: 9,
            },
        },
    };

    /**
     * Sizes of the custom scrollbar.
     */
    public static scrollbar = {
        width: 3,
    };

    /**
     * CSS transition sizes and durations.
     */
    public static transition = {
        duration: 300,
    };

    /**
     * Sizes of write form and its replacement.
     */
    public static contactMessages = {
        writeForm: {
            height: 139,
        },
        writeFormReplacement: {
            height: 40,
        },
    };

    /**
     * Page side menu with.
     */
    public static SideMenuWidth = 400;

    /**
     * App bottom menu height.
     */
    public static BottomAppMenuHeight = 56;
}
