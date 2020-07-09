import Config from "./config";
import { Furniture } from "../types/furniture";

class CanvasCard {

  imageCache: Map<any,any>;

  constructor() {
    this.imageCache = new Map();
  }

  _getCanvasDimensions({ deviceWidth, deviceHeight, imageWidth, imageHeight }:
     { deviceWidth: number, deviceHeight: number, imageWidth: number, imageHeight: number }) {
    //For each unit of width, the image has this height
    const deviceRatio = deviceWidth / deviceHeight;
    const imageRatio = imageWidth / imageHeight;
    if (deviceRatio < imageRatio) {
      return {
        width: imageHeight * deviceRatio,
        height: imageHeight,
        scale: imageHeight / deviceHeight
      };
    }
    return {
      width: imageWidth,
      height: imageWidth / deviceRatio,
      scale: imageWidth / deviceWidth
    };
  }
  _drawImage({ canvasContext, image }: { canvasContext: CanvasRenderingContext2D, image: HTMLImageElement }) {
    const x = 0;
    const y = 0;
    const xOffset = 0.5;
    const yOffset = 0.5;

    const canvasWidth = canvasContext.canvas.width;
    const canvasHeight = canvasContext.canvas.height;

    const imageWidth = image.width;
    const imageHeight = image.height;

    const ratio = Math.min(
      canvasWidth / imageWidth,
      canvasHeight / imageHeight
    );

    const width = imageWidth * ratio;
    const height = imageHeight * ratio;

    // decide which gap to fill
    let ar = 1;
    if (width < canvasWidth) {
      ar = canvasWidth / width;
    }
    if (Math.abs(ar - 1) < 1e-14 && height < canvasHeight) {
      ar = canvasHeight / height;
    }

    const nw = width * ar;
    const nh = height * ar;

    // calc source rectangle
    const cw = imageWidth / (nw / canvasWidth);
    const ch = imageHeight / (nh / canvasHeight);

    const cx = (imageWidth - cw) * xOffset;
    const cy = (imageHeight - ch) * yOffset;

    canvasContext.drawImage(
      image,
      cx < 0 ? 0 : cx,
      cy < 0 ? 0 : cy,
      Math.min(cw, imageWidth),
      Math.min(ch, imageHeight),
      x,
      y,
      canvasWidth,
      canvasHeight
    );
  }

  _doesTextFit({ canvasContext, maxWidth, text }: { canvasContext: CanvasRenderingContext2D, maxWidth: number, text: string }) {
    const measure = canvasContext.measureText(text);
    return measure.width < maxWidth;
  }

  _splitTextIntoLines({ canvasContext, maxWidth, text, font, fontSize }:
  { canvasContext: CanvasRenderingContext2D, maxWidth: number, text: string, font: string, fontSize: number }) {
    canvasContext.font = `${fontSize}px ${font}`;

    const measured = text.split("").reduce(
      ({ buffer, lines }: {buffer: string, lines: any}, char: string) => {
        const newBuffer = buffer + char;
        //Are we on a newline?
        if (char === "\n") {
          return { lines: [...lines, buffer], buffer: "" };
        }
        //Does the text fit ok?
        if (this._doesTextFit({ canvasContext, maxWidth, text: newBuffer })) {
          return { lines: lines, buffer: newBuffer };
        }

        //Can we split at a space?
        const lastSpace = newBuffer.lastIndexOf(" ");
        if (lastSpace !== -1) {
          const left = newBuffer.substring(0, lastSpace);
          const right = newBuffer.substring(lastSpace + 1);
          return {
            lines: [...lines, left],
            buffer: right
          };
        }
        return { lines: [...lines, buffer], buffer: char };
      },
      { buffer: "", lines: [] }
    );

    return [...measured.lines, measured.buffer];
  }

  _drawText({
    canvasContext,
    lines,
    fontSize,
    font,
    initialOffset,
    lineHeight,
    scale
  }:
  {
    canvasContext: CanvasRenderingContext2D,
    lines: string[],
    fontSize: number,
    font: string,
    initialOffset: number,
    lineHeight: number,
    scale: number
  }) {
    canvasContext.font = `${fontSize}px ${font}`;

    lines.forEach((line, i) => {
      const yOffset = initialOffset + lineHeight * (i + 1);
      canvasContext.fillText(line, Config.padding * scale, yOffset);
    });
  }

  _getImageDataUrl(imageUrl: string) {
    const key = encodeURIComponent(imageUrl);
    const maybeItem = this.imageCache.get(key);

    if (maybeItem) {
      return Promise.resolve(maybeItem);
    }

    return fetch(imageUrl)
      .then(res => res.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      )
      .then(dataUrl => {
        this.imageCache.set(key, dataUrl);
        return dataUrl;
      });
  }

  _getImage(imageUrl: string) {
    return this._getImageDataUrl(imageUrl).then(
      dataUrl =>
        new Promise<HTMLImageElement>(resolve => {
          const image = new Image();
          image.addEventListener("load", _ => resolve(image));
          image.src = dataUrl;
        })
    );
  }

  draw(
    canvas: HTMLCanvasElement,
    furniture: Furniture
   ) {
    if (!furniture.imageUrl) {
      return Promise.reject("no-image");
    }

    return this._getImage(furniture.imageUrl).then(image => {
      const [deviceWidth, deviceHeight] = Config.dimensions[furniture.device];

      const { width, height, scale } = this._getCanvasDimensions({
        deviceWidth,
        deviceHeight,
        imageHeight: image.height,
        imageWidth: image.width
      });

      canvas.width = width;
      canvas.height = height;

      const canvasContext = canvas.getContext("2d");

      if(canvasContext){
        this._drawImage({ canvasContext, image });

        const splitHeadline = !furniture.headline
          ? []
          : this._splitTextIntoLines({
              canvasContext,
              maxWidth: Config.headline[furniture.device].maxWidth * scale,
              text: furniture.headline,
              font: Config.headline.font,
              fontSize: Config.headline[furniture.device].fontSize[furniture.headlineSize] * scale
            });

        const splitStandfirst = !furniture.standfirst
          ? []
          : this._splitTextIntoLines({
              canvasContext,
              maxWidth: Config.standfirst[furniture.device].maxWidth * scale,
              text: furniture.standfirst,
              font: Config.standfirst.font,
              fontSize: Config.standfirst[furniture.device].fontSize[furniture.standfirstSize] * scale
            });

        const headlineHeight =
          (splitHeadline.length * Config.headline[furniture.device].lineHeight[furniture.headlineSize] +
            Config.padding) *
          scale;
        const standfirstHeight =
          splitStandfirst.length *
          Config.standfirst[furniture.device].lineHeight[furniture.standfirstSize] * scale;

        const availableHeight = canvas.height - standfirstHeight - headlineHeight - Config.padding * scale

        canvasContext.fillStyle = furniture.headlineColour;

        if (splitHeadline.length > 0) {
          const headlineOffset = availableHeight * furniture.position / 100

          this._drawText({
            canvasContext,
            lines: splitHeadline,
            font: Config.headline.font,
            fontSize: Config.headline[furniture.device].fontSize[furniture.headlineSize] * scale,
            lineHeight: Config.headline[furniture.device].lineHeight[furniture.headlineSize] * scale,
            initialOffset: headlineOffset,
            scale
          });
        }

        canvasContext.fillStyle = furniture.standfirstColour;

        if (splitStandfirst.length > 0) {
          const standfirstOffset = availableHeight * furniture.position / 100 + headlineHeight
          this._drawText({
            canvasContext,
            lines: splitStandfirst,
            font: Config.standfirst.font,
            fontSize: Config.standfirst[furniture.device].fontSize[furniture.standfirstSize] * scale,
            lineHeight: Config.standfirst[furniture.device].lineHeight[furniture.standfirstSize] * scale,
            initialOffset: standfirstOffset,
            scale
          });
        }
      }
    });
  }
}

export default CanvasCard;
