import Vue from 'vue';
import { Component } from 'vue-property-decorator';


/**
 * Facebook sign-in button component.
 */
@Component
export default class Facebook extends Vue {
    /**
     * Initializes Facebook methods.
     */
    public async initFB(): Promise<void> {
        await this.loadFacebookSDK('facebook-jssdk');
        await this.initFacebook();
    }

    /**
     * Logins with facebook.
     */
    public async logInWithFacebook(): Promise<void> {
        window.FB.login(function(response) {
            console.log(response);
            if (response.authResponse) {
                alert('You are logged in &amp; cookie set!');
            } else {
                alert('User cancelled login or did not fully authorize.');
            }
        });
        return;
    }

    /**
     * Inits Facebook client.
     */
    public async initFacebook(): Promise<void> {
        window['fbAsyncInit'] = function() {
            window['FB'].init({
                appId: '2627979924140600',
                cookie: true,
                version: 'v13.0',
            });
        };
    }

    /**
     * Loads Facebook SDK.
     *
     * @param id                        ID that should be set to facebook
     *                                  script.
     */
    public async loadFacebookSDK(id: string): Promise<void> {
        const fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) {
            return;
        }
        const js = document.createElement('script');
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to load Facebook SDK and init it.
     */
    public mounted(): void {
        this.initFB();
    }
}
