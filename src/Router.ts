import Vue from 'vue';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import { Route, RouteConfig, RouterMode, RouterOptions } from 'vue-router/types/router';

// import Apollo from 'plugins/Apollo';
import WebpackAsyncLoader from 'utils/WebpackAsyncLoader';

// import MyUser from 'models/user/MyUser';
// import Session from 'models/user/Session';

import store from 'store';

// import UserModule from 'store/modules/user';

// import * as userModuleActions from 'store/modules/user/actions';
// import * as userModuleGetters from 'store/modules/user/getters';
// import * as userModuleMutations from 'store/modules/user/mutations';
import * as rootActions from 'store/root/actions';

const Chats = () => import('components/pages/chats/Chats.vue');
const Home = () => import('components/pages/home/web/Home.vue');
const Login = () => import('components/pages/login/Login.vue');
const NewPassword = () => import('components/pages/new-password/NewPassword.vue');
import NotFound from 'components/pages/not-found/NotFound.vue';
const Support = () => import('components/pages/support/Support.vue');
const Terms = () => import('components/pages/terms/Terms.vue');
const ContactsPage = () => import('components/pages/contacts/ContactsPage.vue');


/**
 * Configuration of vue-router.
 *
 * More info: {@link http://router.vuejs.org/en}
 */
export default class Router implements RouterOptions {
    /**
     * List of all routes, supported by application.
     *
     * Each router must implement RouteConfig interface, and has at least
     * "path" and "component" properties.
     */
    public routes: RouteConfig[] = [{
        component: WebpackAsyncLoader(Home),
        path: '/',
    }, {
        component: WebpackAsyncLoader(Chats),
        name: 'chats',
        path: '/chats',
    }, {
        component: WebpackAsyncLoader(Login),
        name: 'login',
        path: '/login',
    }, {
        component: WebpackAsyncLoader(NewPassword),
        name: 'new-password',
        path: '/new-password',
    }, {
        component: WebpackAsyncLoader(Login),
        name: 'login',
        path: '/login',
    }, {
        component: WebpackAsyncLoader(NewPassword),
        name: 'new-password',
        path: '/new-password',
    }, {
        component: WebpackAsyncLoader(Terms),
        name: 'terms',
        path: '/terms',
    }, {
        component: WebpackAsyncLoader(Support),
        name: 'support',
        path: '/support',
    }, {
        component: WebpackAsyncLoader(ContactsPage),
        name: 'contacts',
        path: '/contacts',
    }, {
            component: NotFound,
            path: '*',
    }];

    /**
     * Vue-router operating mode.
     *
     * Available values:
     * - hash
     * - history
     * - abstract
     *
     * More info: {@link http://router.vuejs.org/en/api/options.html}
     */
    public mode: RouterMode = 'history';

    /**
     * Is router instance used as part of ssr vue application.
     */
    public ssrMode: boolean;

    /**
     * Vue-router initialized instance.
     */
    private router: VueRouter;

    /**
     * Creates router instance with pre-configured class properties.
     *
     * @param params    Optional, router init params object, that may have:
     *                  - `ssrMode`, shows is router instance used as part of
     *                  ssr vue application.
     */
    public constructor(params?: { ssrMode?: boolean }) {
        if (params !== undefined) {
            this.ssrMode = params.ssrMode || false;
        }

        Vue.use(VueRouter);
        Vue.use(VueMeta);

        this.router = new VueRouter(this);

        this.router.beforeEach((to, from, next) => {
            store.dispatch(rootActions.START_LOADING);
            store.dispatch(rootActions.TOGGLE_MENU_SIDEBAR, {
                force: true,
                isActive: false,
            });
            this.checkIsCallActive();

            next();
        });

        this.router.beforeEach((to, from, next) => {
            this.router.app?.$children[0]
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ? this.router.app.$children[0].closeMenu()
                : next();
            next();
        });

        this.router.beforeEach(this.checkUserAuth.bind(this));

        this.router.afterEach(() => store.dispatch(rootActions.STOP_LOADING));

        this.router.onReady(() => store.dispatch(rootActions.STOP_LOADING));
    }

    /**
     * Returns vue-router instance.
     */
    public get instance(): VueRouter {
        return this.router;
    }

    /**
     * Check saved auth token. Calls as before each hook callback.
     * More info about navigation guards:
     * {@link https://router.vuejs.org/guide/advanced/navigation-guards.html}
     *
     * @param to     The target Route Object being navigated to.
     * @param from   The current route being navigated away from.
     * @param next   This function must be called to resolve the hook.
     */
    public async checkUserAuth(
        to: Route,
        from: Route,
        next: (to?: string | false | ((vm: Vue) => void) | void) => void,
    ): Promise<void> {
        if (this.ssrMode) {
            if (this.ssrAccessControl(to)) {
                return next();
            }
            return next('/401');
        }

        if (this.checkSession()) {
            return next();
        }

        if (await this.checkRememberedSession()) {
            return next();
        }

        // assume, that user is treated as logged out, clear active user data.
        // store.commit(
        //     `${UserModule.vuexName}/`
        //         + userModuleMutations.CLEAR_AUTHORIZED_USER_DATA,
        // );

        return next();
    }

    /**
     * Assure that apollo link is init with saved Session token, if exists
     * and Session is not expired.
     *
     * @return   Is user session valid.
     */
    public checkSession(): boolean {
    // const isTokenSet: boolean = store.getters[
    //     `${UserModule.vuexName}/`
    //         + userModuleGetters.IS_SESSION_TOKEN_SET_IN_HEADERS
    // ];
    // const user: MyUser | null = store.getters[
    //     `${UserModule.vuexName}/${userModuleGetters.AUTHORIZED_USER}`
    // ];
    // const session: Session | null = store.getters[
    //     `${UserModule.vuexName}/${userModuleGetters.SESSION}`
    // ];
    // if (session !== null && !Session.isExpired(session) && user !== null) {
    //     if (isTokenSet) {
    //         return true;
    //     }
    //     Apollo.init(Apollo.initHttpLink(session.token));
    //     store.commit(
    //         `${UserModule.vuexName}/`
    //             + userModuleMutations.SET_IS_SESSION_TOKEN_SET_IN_HEADERS,
    //         true,
    //     );
    //     return true;
    // }
    // return false;
        return true;
    }

    /**
     * Renew user session with saved remembered session.
     *
     * @return   Is session renewed with remembered session.
     */
    public async checkRememberedSession(): Promise<boolean> {
        // const rememberedSession: Session | null = store.getters[
        //     `${UserModule.vuexName}/${userModuleGetters.REMEMBERED_SESSION}`
        // ];
        // if ((rememberedSession !== null)
        //     && (!Session.isExpired(rememberedSession))
        // ) {
        //     const renewResult: boolean = await store.dispatch(
        //         `${UserModule.vuexName}/${userModuleActions.RENEW_SESSION}`,
        //         rememberedSession,
        //     ).catch(() => false);
        //
        //     if (renewResult) {
        //         return true;
        //     }
        // }
        // return false;
        return true;
    }

    /**
     * Route access control for SSR navigation.
     *
     * @param to   The target Route Object being navigated to.
     *
     * @return  Is access granted flag.
     */
    public ssrAccessControl(to: Route): boolean {
        // Mock. TODO: implement access control.
        return to.name !== 'im';
    }

    /**
     * Check is call active and minimize call.
     */
    public checkIsCallActive(): void {
        return;
    }
}
