import GetFulfill from 'utils/GetFulfill';


/**
 * Attachment item, that has been attached by sender to the message.
 */
export default class MessageAttachment {

    /**
     * Unique attachment ID.
     */
    public id: string;

    /**
     * Attachment, type. Usually can be just file extension.
     */
    public type: string;

    /**
     * Attachment name. Usually can be just file name, that can be showed
     * to the end user.
     */
    public name: string;

    /**
     * Url, by what end user can see/download attachment from server.
     */
    public src: string;

    /**
     * Size of the file in bytes.
     */
    public size: number | null;

    /**
     * Upload file error.
     */
    public error: { name: string, message: string } | null;

    /**
     * Initializes attachment with given required properties.
     *
     * @param type   File type.
     * @param src    File see/downlad URL.
     * @param name   File name.
     * @param size   File size in bytes.
     * @param error  Upload file error.
     */
    public constructor(
        type: string,
        src: string,
        name: string,
        size: number | null,
        error: { name: string, message: string } | null,
    ) {
        this.id = GetFulfill.id();
        this.type = type;
        this.src = src;
        this.name = name;
        this.size = size;
        this.error = error;
    }
}
