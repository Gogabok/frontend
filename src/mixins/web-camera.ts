import Vue from 'vue';
import { Component } from 'vue-property-decorator';


type CameraInterfaceType = 'photo' | 'video';
type CameraDirectionType = 'environment' | 'user'

/**
 * Camera logic mixin.
 */
@Component
export default class WebCameraMixin extends Vue {
    /**
     * Camera mode settings (frontal or main).
     */
    public cameraMode: CameraDirectionType =  'user';

    /**
     * Image capture object.
     */
    public imageCapture: ImageCapture | null = null;

    /**
     * Type of interface to be displayed.
     */
    public interfaceType: CameraInterfaceType = 'photo';

    /**
     * Camera stream.
     */
    public mediaStream: MediaStream | null = null;

    /**
     * Stream data chunks.
     */
    public videoChunks: Blob[] = [];

    /**
     * Video object recorded or photo taken.
     */
    public src: string = '';

    /**
     * Size of the media file.
     */
    public fileSize: number = 0;

    /**
     * Indicator whether video is being recorded.
     */
    public isVideoBeingRecorded: boolean = false;

    /**
     * Media recorder.
     */
    public mediaRecorder: MediaRecorder;

    /**
     * Amount of cameras available.
     */
    public videoDevicesAmount: number = 0;

    /**
     * Video Element by ref.
     */
    public get videoElement(): HTMLVideoElement {
        return this.$refs.video as HTMLVideoElement;
    }

    /**
     * Connects to the device's camera.
     *
     * @param interfaceType     Indicator whether camera should take a photo or
     *                          video.
     *
     * @param facingMode        Indicator whether front-camera or main camera
     *                          should be used.
     */
    public initCamera(
        interfaceType: CameraInterfaceType,
        facingMode: CameraDirectionType = 'user',
    ): void {
        if(interfaceType !== this.interfaceType) {
            this.interfaceType = interfaceType;
        }

        navigator.mediaDevices.enumerateDevices()
            .then(res => {
                this.videoDevicesAmount =
                    res.filter(r => r.kind === 'videoinput').length;
            });

        navigator.mediaDevices.getUserMedia({
            audio: this.interfaceType === 'video',
            video: { facingMode },
        })
            .then(this.gotMedia)
            .then(this.translateCamera)
            .catch(error => {
                console.error(
                    'Can\t capture video device (web camera mixin):',
                    error,
                );
                if(error) {
                    navigator.mediaDevices.getUserMedia({
                        audio: this.interfaceType === 'video',
                        video: true,
                    })
                        .then(this.gotMedia)
                        .then(this.translateCamera);
                }
            });
    }

    /**
     * Starts video recording.
     */
    public startVideoRecord(): void {
        this.isVideoBeingRecorded = true;
        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (e) => {
            this.videoChunks.push(e.data);
        };
    }

    /**
     * Stops recording, saves video blob and creates video poster.
     */
    public stopVideoRecord(): void {
        this.isVideoBeingRecorded = false;
        this.mediaRecorder.onstop = async () => {
            const blob = await new Blob(
                this.videoChunks,
                { 'type' : this.videoChunks[0].type },
            );
            this.fileSize = this.videoChunks[0].size;
            const src = await window.URL.createObjectURL(blob);
            this.videoElement.srcObject = null;
            this.videoElement.src = src;
            this.videoElement.muted = false;
            this.src = src;
            this.videoChunks = [];
            this.stopMedia();
        };
        this.mediaRecorder.stop();
    }

    /**
     * Takes media stream and creates interfaces for photo and video record.
     *
     * @param mediaStream       Media stream.
     */
    public async gotMedia(mediaStream: MediaStream): Promise<void> {
        this.mediaStream = mediaStream;

        const mediaStreamTrack = mediaStream.getVideoTracks()[0];
        if (this.interfaceType == 'photo') {
            this.imageCapture = new ImageCapture(mediaStreamTrack);
        } else {
            this.mediaRecorder = await new MediaRecorder(this.mediaStream);
        }
    }

    /**
     * Stops video & audio capturing.
     */
    public stopMedia(): void {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }
        this.mediaStream = null;
    }

    /**
     * Captures a photo.
     */
    public takePhoto(): void {
        if(this.imageCapture === null) return;
        this.imageCapture.takePhoto()
            .then(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    this.fileSize = blob.size;
                    this.src = base64data as string;
                };
            })
            .then(this.stopMedia)
            .catch(error => console.error('takePhoto() error:', error));
    }

    /**
     * Translates image from camera to the video element.
     */
    public translateCamera(): void {
        this.videoElement.srcObject = this.mediaStream;
        this.videoElement.play();
    }

    /**
     * Rotates camera from frontal to main and backwards.
     */
    public rotateCamera(): void {
        this.stopMedia();
        if (this.cameraMode == 'user') {
            this.cameraMode = 'environment';
        } else {
            this.cameraMode = 'user';
        }
        this.initCamera(this.interfaceType, this.cameraMode);
    }
}
