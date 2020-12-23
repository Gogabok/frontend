import { Component, Vue } from 'vue-property-decorator';


/**
 * Router actions.
 */
@Component
export default class RouterActions extends Vue {
    /**
     * Router back method
     */
    goBack(): void {
        this.$router.go(-1);
    }

    /**
     * Router push method
     * @param path - target router path
     */
    goTo(path: string): void {
        this.$router.push(path);
    }
}
