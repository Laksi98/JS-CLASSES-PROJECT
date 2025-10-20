/**
 *
 * @param {HTMLCanvasElement} canvas
 */

const duplicateCanvas = (canvas) => {
  const duplicate = document.createElement("canvas");
  const context = duplicate.getContext("2d");
  duplicate.width = canvas.width;
  duplicate.height = canvas.height;

  if (duplicate.width > 0 && duplicate.height > 0) {
    context.drawImage(canvas, 0, 0);
  } else {
    console.warn("Canvas width or height is 0, skipping drawImage");
  }
  return duplicate;
};

export class CanvasJS {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.image = null;
  }

  /**
   * Load image into canvas
   * @param {string} url
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.image = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.context.drawImage(img, 0, 0);
        resolve();
      };

      img.addEventListener("error", reject);
      img.src = url;
    });
  }

  /**
   * Scale the image
   * @param {number|{x?:number, y?:number}} input
   */
  scale(input) {
    if (!this.image) throw new Error("No image loaded");

    const xScale = typeof input === "number" ? input : input.x??1;
    const yScale = typeof input === "number" ? input : input.y??1;

    // duplicate current canvas
    const duplicate = duplicateCanvas(this.canvas);

    const newWidth = this.canvas.width * xScale;
    const newHeight = this.canvas.height * yScale;

    // Resize original canvas
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    // Draw scaled image -> original canvas
    this.context.drawImage(duplicate, 0, 0, newWidth, newHeight);
  }

  /**
   * Flip the image
   * @param {{x?:boolean, y?:boolean}} direction
   */
  flip(direction = {}) {
    if (!this.image) throw new Error("No image loaded");

    const { x = false, y = false } = direction;
    const duplicate = duplicateCanvas(this.canvas);

    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // apply flipping
    this.context.scale(x ? -1 : 1, y ? -1 : 1);
    this.context.drawImage(
      duplicate,
      x ? -this.canvas.width : 0,
      y ? -this.canvas.height : 0,
      this.canvas.width,
      this.canvas.height
    );

    this.context.restore();
  }
}
