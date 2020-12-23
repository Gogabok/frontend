import { MovementHandler } from 'utils/moveHandler';
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import counter from 'mixins/counter.ts';
import filters from 'mixins/filters.ts';

import AngleIcon from 'components/icons/AngleIcon.vue';
import DeleteIcon from 'components/icons/DeleteIcon.vue';
import SendMessageIcon from 'components/icons/SendMessageIcon.vue';


/**
 * Audio record panel component, that allows user to send audio message.
 */
@Component({
    components: {
        'angle-icon': AngleIcon,
        'delete-icon': DeleteIcon,
        'send-message-icon': SendMessageIcon,
    },
    filters,
})
export default class AudioRecordPanel extends mixins(counter) {
    /**
     * Indicator whether panel should be visible or not.
     */
    @Prop({
        default: false,
        type: Boolean,
    }) isVisible;


    /**
     * Audio stream.
     */
    public stream: MediaStream | null = null;

    /**
     * Media recorder.
     */
    public mediaRecorder;

    /**
     * Chunks of recorded data.
     */
    public chunks: Blob[] = [];

    /**
     * Movement handler, responsible for send icon movement.
     */
    public movementHandler: MovementHandler = new MovementHandler();

    /**
     * Cancel icon element.
     */
    get cancelIcon(): HTMLElement {
        return this.$refs.cancelIcon as HTMLElement;
    }

    /**
     * Send icon element.
     */
    get sendIcon(): HTMLElement {
        return this.$refs.sendIcon as HTMLElement;
    }

    /**
     * Cancel text element.
     */
    get cancelText(): HTMLElement {
        return this.$refs.cancelText as HTMLElement;
    }

    /**
     * Handles send icon click.
     *
     * @param e                         `touchstart`/`mousedown` event.
     */
    public startHandler(e: TouchEvent | MouseEvent): void {
        e.stopPropagation();
        const startedMicroPosition = getPosBasedOnDevice(e).x;
        const endMicroPosition =
            this.cancelIcon.getBoundingClientRect().left
            + this.cancelIcon.offsetWidth;
        const iconsDistance = startedMicroPosition - endMicroPosition;
        let diff = 0, moved = false;

        /**
         * Gets the position of mouse or finger.
         *
         * @param event     Click or touch Event.
         */
        function getPosBasedOnDevice(event: TouchEvent | MouseEvent): {
            x: number,
            y: number,
        } {
            if(event.type.indexOf('mouse') !== -1) {
                event = event as MouseEvent;
                return { x: event.pageX, y: event.pageY };
            } else {
                event = event as TouchEvent;
                return{
                    x: event.changedTouches[0].pageX,
                    y: event.changedTouches[0].pageY,
                };
            }
        }


        /**
         * Animates the icons based on progress value provided.
         *
         * @param progress              Progress value.
         */
        const setDistance = (progress: number): void => {
            // const rotate = 0 - (progress * 1.6)
            const opacity = 1 + progress / 100;
            const zoom = 1 + progress / 300;
            this.sendIcon.style.cssText =
                `transform: translateX(${progress*0.97}px) scale(${zoom})`;
            this.cancelText.style.cssText =
                `transform: translateX(${progress / 5}px); opacity: ${opacity}`;
        };

        /**
         * Handles send icon dragging.
         *
         * @param e                     `touchmove`/`mousemove` event.
         */
        const handleMove = (e: TouchEvent | MouseEvent): void => {
            moved = true;
            const movePosition = getPosBasedOnDevice(e).x;
            diff = startedMicroPosition - movePosition;
            if (diff > 0 && diff < iconsDistance + 15) {
                setDistance(-diff);
            }
        };

        /**
         * Handles end of send icon dragging. Resets all the variables to init
         * values.
         *
         * @param e                     `touchend` | `mouseup` event.
         */
        const endHandler = (e: TouchEvent | MouseEvent): void => {
            e.stopPropagation();
            if (diff < iconsDistance / 2) {
                setDistance(0);
                !moved && this.sendAudio();
                clearListeners(e);
            } else if (diff > iconsDistance /2) {
                clearListeners(e);
                this.closeMicrophoneMenu();
                setTimeout(() => {
                    setDistance(0);
                }, 400);
            }
        };

        /**
         * Removes event move mouse/touch-move and mouse/touch-up events
         * listeners.
         *
         * @param e                     `mouseup`/`touchend` event.
         */
        function clearListeners(e: TouchEvent | MouseEvent) {
            if(e.type.indexOf('mouse') !== -1) {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', endHandler);
            } else {
                window.removeEventListener('touchmove', handleMove);
                window.removeEventListener('touchend', endHandler);
            }
        }

        if(e.type.indexOf('mouse') !== -1) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', endHandler);
        } else {
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', endHandler);
        }
    }

    /**
     * Closes audio record panel.
     */
    public closeMicrophoneMenu(): void {
        this.$emit('close');
        this.clearCounter();
        this.clearAudio();
    }

    /**
     * Gets user record device.
     */
    public async initAudio(): Promise<void> {
        try{
            const options = { audio: true };
            const stream = await navigator.mediaDevices.getUserMedia (options);
            this.setStream(stream);
        } catch(e) {
            console.error(`The following getUserMedia error occured:\n${e}`);
        }
    }

    /**
     * Initiates new media recorder and starts to record the data.
     * Also, starts the timer.
     *
     * @param stream                    Device to listen from.
     */
    public async setStream(stream: MediaStream): Promise<void> {
        this.stream = stream;
        this.mediaRecorder = await new MediaRecorder(stream);
        navigator.vibrate(100);
        this.mediaRecorder.start();
        this.startCounter();

        this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
        };
    }

    /**
     * Stops recording, sends message and closes the audio record panel.
     */
    public stopRecord(): void {
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(
                this.chunks,
                { 'type' : 'audio/ogg; codecs=opus' },
            );
            this.chunks = [];
            const audioURL = window.URL.createObjectURL(blob);

            const payload = {
                size: '34 Mb',
                src: audioURL,
                type: 'audio',
            };
            this.$emit('send-message', payload);
            this.closeMicrophoneMenu();
        };
    }

    /**
     * Removes the device info, removes media recorder and clears data chunks.
     */
    public clearAudio(): void {
        const stream = this.stream;
        if(stream !== null) {
            (stream as MediaStream).getTracks().forEach(track => {
                track.stop();
            });
        }
        this.stream = null;
        this.mediaRecorder = null;
        this.chunks = [];
    }

    /**
     * Sends an audio message.
     */
    public sendAudio(): void {
        this.stopRecord();
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to init audio record.
     */
    public mounted(): void {
        this.initAudio();
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to clear counter and free audio
     * media capture device.
     */
    public beforeDestroy(): void {
        this.clearCounter();
        this.clearAudio();
    }
}
