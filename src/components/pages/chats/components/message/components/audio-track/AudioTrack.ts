import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import PauseIcon from 'components/icons/PauseIcon.vue';
import PlayIcon from 'components/icons/PlayIcon.vue';


/**
 * Visual component for audio message.
 */
@Component({
    components: {
        'pause-icon': PauseIcon,
        'play-icon': PlayIcon,
    },
})
export default class AudioTrack extends Vue {
    /**
     * Link to the audio message.
     */
    @Prop({
        default: '',
        type: String,
    }) link: string;

    /**
     * Height parameters of the volume bars.
     */
    public heightParams: number[] = [];

    /**
     * Index of the current active bar.
     */
    public activeNum: number = 0;

    /**
     * Amount of the volume bars.
     */
    public count: number = 40;

    /**
     * Indicator whether audio message is being played.
     */
    public isPlayed: boolean = false;

    /**
     * Message duration statements.
     */
    public duration = {
        currentTime: 0,
        minutes: 0,
        remainingMinutes: 0,
        remainingSeconds: 0,
        remainingTotal: 0,
        seconds: 0,
        total: 0,
    }

    /**
     * Interval which changes the activeIndex as user listens to the message.
     */
    public barChangeInterval: number;

    /**
     * Media stream to be played.
     */
    public media: HTMLAudioElement | null = null;

    /**
     * Syncs visual progress to audio currentTime.
     *
     * @param val    Value of the progress.
     */
    @Watch('duration.currentTime')
    watchCurrentTime(val: number): void {
        this.$emit(
            'remaining-time-change',
            this.duration.total - val,
        );
        this.duration.remainingTotal = this.duration.total - val;
    }

    /**
     * Get the random number value between min and max.
     *
     * @param min    lowest possible random value.
     * @param max    highest possible random value.
     */
    public getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * Changes the currentTime of the audio message depending on the index.
     *
     * @param index  Number of the bar user clicked to.
     */
    public selectTime(index: number): void {
        if(!this.media) return;
        this.activeNum = index;
        this.media.currentTime = this.duration.total * index/ this.count;
    }

    /**
     * Plays or pauses the audio message depending of the current playstate.
     */
    public playAudioHandle(): void {
        if (this.isPlayed) {
            this.pauseAudio();
        } else {
            this.startAudio();
        }
    }

    /**
     * Plays the audio message.
     */
    public startAudio(): void {
        if(!this.media) return;
        this.media.play().then(() => {
            this.isPlayed = true;
            this.barChangeInterval = setInterval(
                this.audioIncrease,
                1000 / this.count * this.duration.total,
            );
        }) ;
    }

    /**
     * Pauses the audio message.
     * Also, clears the barChangeInterval.
     */
    public pauseAudio(): void {
        if (!this.media) return;
        this.media.pause();
        this.isPlayed = false;
        clearInterval(this.barChangeInterval);
    }

    /**
     * Pauses the audio message, sets progress to 0.
     */
    public handleAudioEnded(): void {
        this.pauseAudio();
        if(!this.media) return;
        this.media.currentTime = 0;
        this.activeNum = 0;
    }

    /**
     * Increases the current active bar index.
     */
    public audioIncrease(): void {
        this.activeNum++;
    }

    /**
     * Pauses the audio if user click outside of the element.
     *
     * @param e     Click/touch event.
     */
    public stopAudioOutside(e: MouseEvent | TouchEvent): void {
        // TODO: Discuss the possibility of replacing this with all-app widget
        // to play or pause the message.
        if (!this.$el.contains(e.target as Node)) {
            this.pauseAudio();
        }
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to load audio message data.
     * Also, creates the height parameters for each volume bar.
     * Also, creates event listener, that will pause the message on click
     * outside
     */
    public mounted(): void {
        this.media = this.$el.querySelector('audio');

        if(!this.media) return;

        this.media.onloadedmetadata = async (): Promise<void> => {
            if(!this.media) return;
            while(this.media.duration === Infinity) {
                await new Promise(r => setTimeout(r, 100));
                this.media.currentTime = 10000000*Math.random();
            }
            this.media.currentTime = 0;
            const duration = parseFloat(this.media.duration.toFixed(0));
            const seconds = duration % 60;
            this.duration.minutes = (duration - seconds) / 60;
            this.duration.seconds = seconds;
            this.duration.total = duration;
            this.duration.remainingTotal = duration;
        };

        /**
         * Handles the end of the audio message.
         */
        this.media.onended = (): void => {
            this.handleAudioEnded();
        };

        /**
         * Updates the current time label.
         */
        this.media.ontimeupdate = () => {
            if(!this.media) return;
            this.duration.currentTime =
                parseFloat(this.media.currentTime.toFixed(0));
        };

        for (let i = 0; i <= this.count; i++) {
            this.heightParams.push(
                parseFloat(this.getRandomArbitrary(3, 30).toFixed(2)),
            );
        }

        document.addEventListener('click', this.stopAudioOutside);
    }
}
