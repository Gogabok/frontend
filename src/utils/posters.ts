import { getFormattedSize } from 'utils/files';


/**
 * Creates the poster for the video.
 *
 * @param src       Link to the video file.
 */
export async function createVideoPoster(src: string): Promise<string> {
    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d') as CanvasRenderingContext2D,
          video = document.createElement('video');

    video.setAttribute('src', src);
    video.setAttribute('type', 'video/mp4');

    video.onloadedmetadata = () => {
        video.play();
    };

    return await new Promise((resolve) => {
        video.onplay = function() {
            setTimeout(() => {
                video.pause();
                video.currentTime = 0;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpg'));
                // Wait for 2 frames to play.
            }, 1000 / 30 * 2);
        };
    }).then(res => res as string);
}

/**
 * Resizes image to provided parameters.
 *
 * @param src           Image link.
 * @param width         New image width.
 * @param height        New image height.
 */
export async function resizeImage(
    src: string,
    {
        width = 800,
        height = 800,
    } = {},
): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();
    canvas.width = width;
    canvas.height = height;

    return new Promise(resolve => {
        image.onload = () => {
            const ratio = image.naturalWidth / image.naturalHeight;
            canvas.height = canvas.width / ratio;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL());
        };
        image.src = src;
    });
}

/**
 * Creates poster for non media files.
 */
export async function createDocPoster(file: File): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const imageSource = require('~assets/img/icons/attachment.svg'); //eslint-disable-line

    canvas.width = 800;
    canvas.height = 800;
    const FONT_SIZE = 16;
    const LINE_HEIGHT = 1.33;

    const image = new Image();

    return await new Promise((resolve) => {
        image.onload = () => {
            const [imageWidth, imageHeight] = [
                0.12 * canvas.width,
                image.width / image.height * 0.12 * canvas.width,
            ];

            drawPinIcon({
                context: ctx,
                image: image,
                size: { height: imageHeight, width: imageWidth },
            });

            drawLabels({
                color: '#313131',
                context: ctx,
                fontFamily: 'Verdana, sans-serif',
                fontSize: FONT_SIZE,
                label: { name: file.name, size: getFormattedSize(file.size) },
                lineHeight: LINE_HEIGHT,
            });

            resolve(canvas.toDataURL('image/jpg'));
        };

        image.src=imageSource;
    }).then(res => res as string);
}

/**
 * Draws pin icon of provided size and moved up from the center for ~3% of the
 * canvas height.
 *
 * @param context       Canvas context.
 * @param size          Size of icon to be drawn.
 * @param image         Image object to be drawn.
 */
function drawPinIcon(
    {
        context,
        size,
        image,
    }: {
        context: CanvasRenderingContext2D,
        size: {width: number, height: number},
        image: HTMLImageElement,
    },
): void {
    context.save();
    context.fillStyle = '#f8f8f8';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(context.canvas.width/2, context.canvas.height/2);
    context.rotate(-Math.PI / 4);
    context.drawImage(
        image,
        (size.height * 0.1) * Math.sin(-Math.PI/4),
        (- size.width - context.canvas.height * 0.08) * Math.cos(Math.PI / 4),
        size.height,
        size.width,
    );
    context.restore();
}

/**
 * Draws name and size of the file.
 *
 * @param context       Canvas context.
 * @param fontSize      Font size.
 * @param lineHeight    Line height.
 * @param color         Font color.
 * @param label         Name and size of the file.
 * @param fontFamily    Font family to be used.
 */
function drawLabels(
    {
        context,
        fontSize,
        lineHeight,
        color,
        label,
        fontFamily,
    }: {
        context: CanvasRenderingContext2D,
        fontSize: number,
        lineHeight: number,
        color: string,
        label: {name: string, size: string},
        fontFamily: string,
    },
): void {
    context.fillStyle = color;
    context.font =
        `${context.canvas.width / 200 * fontSize}px ${fontFamily}`;
    context.fillText(
        label.name,
        context.canvas.width / 2 - context.measureText(label.name).width / 2,
        context.canvas.height / 2 + context.canvas.height * 0.09,
    );
    context.fillText(
        label.size,
        context.canvas.width / 2 - context.measureText(label.size).width / 2,
        context.canvas.height / 2 + context.canvas.height * 0.09 +
        context.canvas.width / 200 * fontSize * lineHeight,
    );
}
