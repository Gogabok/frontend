import 'tns-core-modules/ui/core/view';


declare module 'tns-core-modules/ui/core/view' {
    interface View {

        /**
         * Shows sidedrawer if it'a closed.
         */
        showDrawer(): void;

        /**
         * Shows sidedrawer if it'a closed.
         */
        closeDrawer(): void;
    }
}
