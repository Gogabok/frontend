import Vue from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * Counter logic.
 */
@Component
export default class CounterMixin extends Vue {
    /**
     * Increment function.
     */
    public counterFunc: number = 0;

    /**
     * Time parameters.
     */
    public secCounter: {
        milliSeconds: number,
        minutes: number,
        seconds: number,
    } = {
        milliSeconds: 0,
        minutes: 0,
        seconds: 0,
    };

    /**
     * Stops the timer and sets time to `0.0`.
     */
    public clearCounter(): void {
        clearInterval(this.counterFunc);
        for (const key in this.secCounter) {
            this.secCounter[key] = 0;
        }
    }
    /**
     * Increments counter time parameters.
     */
    public counterIncrease(): void {
        this.secCounter.milliSeconds += 10;
        if (this.secCounter.milliSeconds >= 100) {
            this.secCounter.milliSeconds = 0;
            this.secCounter.seconds++;
        }
        if (this.secCounter.seconds >= 60) {
            this.secCounter.seconds = 0;
            this.secCounter.minutes++;
        }
    }
    /**
     * Sets interval.
     */
    public startCounter(): void {
        this.counterFunc = setInterval(this.counterIncrease, 100);
    }
}
