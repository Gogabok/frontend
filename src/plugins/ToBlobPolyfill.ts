/**
 * Canvas to Blob is a polyfill for the standard JavaScript canvas.toBlob
 * method.
 *
 * More info: {@link https://github.com/blueimp/JavaScript-Canvas-to-Blob}
 */
export const dataURLtoBlob = (HTMLCanvasElement.prototype.toBlob === undefined)
    ? require('blueimp-canvas-to-blob')
    : null;

export default dataURLtoBlob;
