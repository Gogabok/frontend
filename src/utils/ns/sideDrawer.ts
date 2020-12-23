import { getRootView } from 'tns-core-modules/application';
import { View } from 'tns-core-modules/ui/core/view';


/**
 * Opens sideDrawer from nativeView instance.
 */
export function showSideDrawer(): void {
    const drawerNativeView: View = getRootView();
    if (drawerNativeView && drawerNativeView.showDrawer) {
        drawerNativeView.showDrawer();
    }
}

/**
 * Closes sideDrawer from nativeView instance.
 */
export function closeSideDrawer(): void {
    const drawerNativeView: View = getRootView();
    if (drawerNativeView && drawerNativeView.closeDrawer) {
        drawerNativeView.closeDrawer();
    }
}
