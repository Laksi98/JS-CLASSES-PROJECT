import { CanvasJS } from "./module/Canvas.js";

const canvas = new CanvasJS();

canvas
  .loadImage("./samples/flower.png")
  .then(() => {
    canvas.scale({ x: 0.5 });

    canvas.flip({x:true });

    document.body.appendChild(canvas.canvas);
  })
  .catch(console.error);
