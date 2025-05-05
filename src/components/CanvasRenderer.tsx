import { useEffect, useState } from "react";

type CanvasRendererProps = {
  file: File | null;
  onRender: (img: ImageData) => void;
};
export const CanvasRenderer = ({ file, onRender }: CanvasRendererProps) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (file && canvasRef) {
      createImageBitmap(file).then((bitmap) => {
        const { width, height } = bitmap;
        const ctx = canvasRef.getContext("2d", {
          willReadFrequently: true,
        });
        if (ctx) {
          ctx.canvas.width = width;
          ctx.canvas.height = height;
          ctx.drawImage(bitmap, 0, 0);
          onRender(ctx.getImageData(0, 0, width, height));
        }
      });
    }
  }, [file, canvasRef]);

  return <canvas ref={setCanvasRef} />;
};
