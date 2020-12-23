/**
 * Sets styles, provided in `settings` for each element of `elements`.
 * If transition settings provided, removes them after animation finished.
 *
 * @param elements      List of elements to be animated.
 * @param settings      List of parameters to be animated.
 */
export function smoothTransition({ elements, settings }: {
    elements: HTMLElement[],
    settings: {[key: string]: string},
}): void {
    elements.forEach((element) => {
        Object.entries(settings).forEach(([parameter, value]) => {
            element.style[parameter] = value;
        });
    });

    if('transition' in settings) {
        const transition = settings.transition;
        const duration = (transition
            .match(/([0-9]+)ms/g) as string [])
            .map(time => parseInt(time))
            .reduce((max, time) => max > time ? max : time, 0);

        setTimeout(() => {
            elements.forEach(element => element.style.transition = '');
        }, duration);
    }
}
