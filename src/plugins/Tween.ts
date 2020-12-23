import TWEEN from '@tweenjs/tween.js';

import Sizes from 'utils/Sizes';


/**
 * Helper for easily using tween.js library.
 *
 * More info and documentation:
 * {@link https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md}
 */
export default class Tween {

    /**
     * Animate element property from current value to the specified
     * with optional duration.
     *
     * @param el         HTMLElement, whose property will be animated.
     * @param property   Property name, whose value will be animated.
     * @param to         Target value, that property will be animated to.
     * @param duration   Optional, duration time in ms that will be used.
     *
     * @return   Resolved promise when animation has been completed.
     */
    public static animateElementProperty(
        el: HTMLElement,
        property: string,
        to: number,
        duration: number = Sizes.transition.duration,
    ): Promise<void> {
        return new Promise((resolve) => {
            new TWEEN.Tween({ [property]: el[property] })
                .to({ [property]: to }, duration)
                .onUpdate((photosSection) => {
                    el[property] = photosSection[property];
                })
                .onComplete(() => resolve)
                .start();

            Tween.animate();
        });
    }

    /**
     * Helper function to update all active tweens.
     */
    private static animate() {
        requestAnimationFrame(Tween.animate);
        TWEEN.update();
    }
}
