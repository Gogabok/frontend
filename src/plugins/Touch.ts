import Vue from 'vue';
import { DirectiveBinding } from 'vue/types/options';


const Hammer = (typeof window !== 'undefined') ? require('hammerjs') : null;

/**
 * Touch handling with hammerjs.
 *
 * More info: {@link http://hammerjs.github.io/}
 */
export default class Touch {

    /**
     * Contains handling events.
     */
    public static events: string[] = [
        'swipe',
        'swipeleft',
        'swiperight',
        'swipeup',
        'swipedown',
    ];

    /**
     * Initializes v-touch directive.
     */
    public static init(): void {
        Vue.directive('touch', {
            bind: this.bind,
            componentUpdated: this.componentUpdated,
            unbind: this.unbind,
        });
    }

    /**
     * Directive hook.
     * Called only once, when the directive is first bound to the element.
     *
     * @param el        The element the directive is bound to.
     * @param binding   DirectiveBinding object.
     */
    public static bind(el: any, binding: DirectiveBinding): void { // eslint-disable-line
        if (Hammer === null) {
            return;
        }
        Touch.initHammer(el, binding.arg === 'init' ? binding.value : {});
        if ((!Touch.events.find((e) => e === binding.arg))
            || (typeof binding.value !== 'function')
        ) {
            return;
        }
        const touch = el.hammer;
        touch.on(binding.arg, binding.value);
    }

    /**
     * Directive hook.
     * Called after the containing component’s VNode and the VNodes of its
     * children have updated.
     *
     * @param el        The element the directive is bound to.
     * @param binding   DirectiveBinding object.
     */
    public static componentUpdated(el: any, binding: DirectiveBinding): void { // eslint-disable-line
        const touch = el.hammer;
        if ((!touch)
            || (typeof binding.value !== 'function')
        ) {
            return;
        }
        touch.off(binding.arg);
        touch.on(binding.arg, binding.value);
    }

    /**
     * Directive hook.
     * Called only once, when the directive is unbound from the element.
     *
     * @param el        The element the directive is bound to.
     * @param binding   DirectiveBinding object.
     */
    public static unbind(el: any, binding: DirectiveBinding): void { // eslint-disable-line
        const touch = el.hammer;
        if (touch) {
            touch.off(binding.arg);
        }
    }

    /**
     * Inits Hammer instance for the element.
     *
     * @param el        The element the Hammer is inits for.
     * @param options   Hammer init options, such as:
     *                  - direction, part of the Hammer direction constants.
     */
    public static initHammer(
        el: any, // eslint-disable-line
        options: { direction?: string } = {},
    ): void {
        if (el.hammer || Hammer === null) {
            return;
        }
        const directionPart = options.direction || 'horizontal';
        const direction = Hammer['DIRECTION_' + directionPart.toUpperCase()];
        el.hammer = new Hammer.Manager(el, {
            domEvents: true,
            inputClass: Hammer.TouchInput,
            recognizers: [
                [Hammer.Swipe, { direction }],
            ],
        });
    }
}
