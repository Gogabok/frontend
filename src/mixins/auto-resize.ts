import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * `input` tag auto resize logic.
 */
@Component
export default class AutoResizeMixin extends Vue {
    /**
     * Resizes event target to fit the content.
     *
     * @param event         `input` event.
     * @param maxHeight     Max height to be set.
     * @returns             `true` if component has been resized,
     *                      `false` otherwise.
     */
    autoResize(event: InputEvent, maxHeight: number): boolean {
        const target = event.target as HTMLElement;
        if (!target) return false;

        if (target.scrollHeight <= maxHeight) {
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;

            const barContainer: HTMLElement | null =
                document.querySelector('.vue-bar-container');
            if(barContainer) {
                const height = (target.scrollHeight) + 20 > 55
                    ? (target.scrollHeight) + 20
                    : 55;
                barContainer.style.paddingBottom =
                    `${height}px`;
            }
            return true;
        } else {
            return false;
        }
    }
}
