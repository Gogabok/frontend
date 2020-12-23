import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { Attachment } from 'models/Attachment';
import { MetaInfo } from 'models/MetaInfo';

import {
    getAttachmentType,
    getExtension,
    getPoster,
} from 'utils/files';
import { isFilled } from 'utils/Validations';

import GeneralParametersModule from 'store/modules/general-parameters';

import {
    IS_FORCE_MOBILE_MODE,
    IS_MOBILE_MODE,
} from 'store/modules/general-parameters/getters';

import PlusIcon from 'components/icons/PlusIcon.vue';
import ReportProblem from 'components/icons/ReportProblem.vue';

import Preview from './components/preview/Preview.vue';


const GeneralParameters = namespace(GeneralParametersModule.vuexName);

/**
 * Support page component.
 */
@Component({
    components: {
        'plus-icon': PlusIcon,
        'report-problem': ReportProblem,
        'support-preview': Preview,
    },
})
export default class Support extends Vue {
    /**
     * Previews gallery.
     */
    public previewsGallery: Attachment[] = [];

    /**
     * Problem description.
     */
    public problemText: string = '';

    /**
     * Attachment container width.
     */
    public containerWidth: number = 0;

    /**
     * Indicator whether mobile mode is active.
     */
    @GeneralParameters.Getter(IS_MOBILE_MODE)
    public isNativeMobileMode: boolean;

    /**
     * Indicator whether force mobile mode is active.
     */
    @GeneralParameters.Getter(IS_FORCE_MOBILE_MODE)
    public isForceMobileMode: boolean;

    /**
     * Indicator whether mobile mode is active (whether it's native of force).
     */
    public get isMobileMode(): boolean {
        return this.isForceMobileMode || this.isNativeMobileMode;
    }

    /**
     * Returns attachment drag container by ref.
     */
    public get attachmentDrag():HTMLElement {
        return this.$refs.attachmentDrag as HTMLElement;
    }

    /**
     * Page meta information:
     * - title;
     * - meta tags content;
     * - etc.
     */
    public get metaInfo(): MetaInfo {
        return {
            meta: [
                {
                    content: 'Report a Problem description',
                    name: 'description',
                },
                {
                    content: 'Report a Problem keywords',
                    name: 'keywords',
                },
            ],
            title: 'Report a Problem',
        };
    }

    /**
     * Adds dragged files to attachments list.
     * Also, displays files' previews.
     *
     * @param e                         `drag` or `input` event.
     */
    public handleDrop(e: DragEvent | InputEvent): void {
        const target = e.type === 'drop'
            ? (<DragEvent>e).dataTransfer as DataTransfer
            : e.target as HTMLInputElement & { files: FileList };
        const filesAmount = target.files.length;
        for (let i = 0; i < filesAmount; i++) {
            const file = target.files[i];
            this.previewFile(file);
        }

        if (e.type === 'change') {
            (target as HTMLInputElement).value = '';
        }
    }

    /**
     * Submits report and clears form data if it's valid.
     */
    public submitProblem(): void {
        const isFilledProblemText = isFilled(this.problemText);
        if (!isFilledProblemText && !this.previewsGallery.length) return;
        this.problemText = '';
        this.clearPreview();
    }

    /**
     * Opens browser's file manager to upload screenshots/videos.
     */
    public handleAttachment(): void {
        const input = this.$refs.attachInput as HTMLElement;
        input.click();
    }

    /**
     * Adds file preview to previews list.
     *
     * @param file                      Attachment file.
     */
    public previewFile(file: File): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const payload: Attachment = {
                extension: getExtension(file),
                id: `attachment_${new Date().getTime()}-${file.type}`,
                name: file.name
                    .split('.')
                    .slice(0, file.name.split('.').length - 1)
                    .join('.'),
                poster: await getPoster(file, reader.result as string),
                size: file.size,
                src: file,
                type: getAttachmentType(file),
            };

            this.previewsGallery.push(payload);
        };
    }

    /**
     * Deletes attachment item from attachments and previews array.
     *
     * @param id                        Attachment item ID.
     */
    public deleteAttachmentItem(id: string): void {
        this.previewsGallery = this.previewsGallery.filter(
            item => item.id !== id,
        );
    }

    /**
     * Clears attachments and previews array.
     */
    public clearPreview(): void {
        this.previewsGallery = [];
    }

    /**
     * Prevents default functionality of the event and stops its' propagation.
     *
     * @param e                         `event`.
     */
    public preventDefaults(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Hooks `mounted` Vue lifecycle stage to add dragZone
     * listeners and set attachment container width.
     */
    public mounted(): void {
        if (this.attachmentDrag) {
            const dragArr = ['dragenter', 'dragover', 'dragleave', 'drop'];
            dragArr.forEach(eventName => {
                const dragZone = this.attachmentDrag;
                dragZone.addEventListener(
                    eventName,
                    this.preventDefaults,
                    false,
                );
            });
            const dragZone = this.attachmentDrag;
            dragZone.addEventListener('drop', this.handleDrop, false);
        }
        if (this.isMobileMode) {
            this.containerWidth = (window.innerHeight - 60 - 55 - 130) / 2;
        } else {
            const preview = this.$refs.previewContainer as HTMLElement;
            this.containerWidth = preview.offsetWidth - 20;
        }
    }

    /**
     * Hooks `beforeDestroy` Vue lifecycle stage to remove drag zone listeners.
     */
    public beforeDestroy():void {
        if (this.attachmentDrag) {
            const dragArr = ['dragenter', 'dragover', 'dragleave', 'drop'];
            dragArr.forEach(eventName => {
                const dragZone = this.attachmentDrag;
                dragZone.removeEventListener(
                    eventName,
                    this.preventDefaults,
                    false,
                );
            });
            const dragZone = this.attachmentDrag;
            dragZone.removeEventListener('drop', this.handleDrop, false);
        }
    }
}
