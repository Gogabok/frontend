/**
 * Copies text to clipboard in older browsers.
 *
 * @param text          Text to be copied.
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

/**
 * Copies text to clipboard.
 *
 * @param text          Text to be copied.
 */
export function copyTextToClipboard(text: string): void {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
}

/**
 * Converts image to blob to copy. Used to copy image to clipboard.
 *
 * @param url           Link to the image.
 */
export async function imageToBlob(url: string): Promise<Blob> {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let isImageConverted = false;
    let blob;

    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
            b => {
                blob = b;
                isImageConverted = true;
            },
            'image/png',
            0.75,
        );
    };
    img.setAttribute('crossorigin', 'anonymous');
    img.src = url;

    function timeout(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    while(!isImageConverted) {
        await timeout(50);
    }
    return blob;
}
