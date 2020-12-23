import { Component, Prop, Vue } from 'vue-property-decorator';

import { showSideDrawer } from 'utils/ns/sideDrawer';


/**
 * Common action bar that opens side drawer.
 */
@Component
export default class CommonActionBar extends Vue {

    /**
     * Title for title section on the actionbar.
     */
    @Prop({ required: true })
    public title: string;

    /**
     * Shows sideDrawer on user's tap.
     */
    public showSideDrawer(): void {
        showSideDrawer();
    }
}
