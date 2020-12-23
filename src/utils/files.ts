import { createDocPoster, createVideoPoster, resizeImage } from 'utils/posters';

import { AttachmentType } from 'models/Attachment';


/**
 * Checks if provided file is an image or a video.
 *
 * @param file      File object.
 */
export function isMediaFile(file: File): boolean {
    return file.type.includes('image') || file.type.includes('video');
}

/**
 * Returns file extension.
 *
 * @param file      File whose extension should be returned.
 */
export function getExtension(file: File): string {
    return file.name.split('.').pop() as string;
}

/**
 * Creates poster for provided file based on it's type.
 *
 * @param file      File object.
 * @param src       Link to the file source.
 */
export async function getPoster(file: File, src: string): Promise<string> {
    return isMediaFile(file)
        ? file.type.includes('video')
            ? await createVideoPoster(src)
            : await resizeImage(src)
        : await createDocPoster(file);
}

/**
 * Returns file size in human readable format.
 *
 * @param size      Size to be formatted.
 */
export function getFormattedSize(size: number): string {
    return size < 1000000
        ? size < 1000
            ? size.toString() + 'B'
            : Math.floor(size/1000).toString() + 'KB'
        : Math.floor(size/1000000).toString() + 'MB';
}

/**
 * Returns attachment of provided file.
 *
 * @param file      File object.
 */
export function getAttachmentType(file: File): AttachmentType {
    return isMediaFile(file)
        ? file.type.includes('image') ? 'image' : 'video'
        : 'doc';
}
