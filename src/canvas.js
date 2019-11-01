import Config from "./config";

class CanvasCard {
  constructor() {
    this.imageCache = new Map();
  }

  _getNewCanvas({ width, height }) {
    const canvas = document.createElement("canvas");

    canvas.classList.add("card");
    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  _getCanvasDimensions({ deviceWidth, deviceHeight, imageWidth, imageHeight }) {
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
  _drawImage({ canvasContext, image }) {
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

  _doesTextFit({ canvasContext, maxWidth, text }) {
    const measure = canvasContext.measureText(text);
    return measure.width < maxWidth;
  }

  _splitTextIntoLines({ canvasContext, maxWidth, text, font, fontSize }) {
    canvasContext.font = `${fontSize}px ${font}`;

    const measured = text.split("").reduce(
      ({ buffer, lines }, char) => {
        const newBuffer = buffer + char;
        //Are we on a newline?
        if (char === "\n") {
          return { lines: [...lines, buffer], buffer: char };
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
    lineHeight
  }) {
    canvasContext.font = `${fontSize}px ${font}`;

    lines.forEach((line, i) => {
      const yOffset = initialOffset + lineHeight * (i + 1);
      canvasContext.fillText(line, Config.padding, yOffset);
    });
  }

  _drawSvg({ canvasContext, svg, scale }) {
    return new Promise(resolve => {
      const image = new Image();
      image.width = Config.svgWidth * scale;
      image.src = `data:image/svg+xml;base64,${window.btoa(svg)}`;

      image.addEventListener("load", _ => {
        canvasContext.drawImage(image, Config.padding, Config.padding);
        resolve();
      });
    });
  }

  _getImageDataUrl({ imageUrl }) {
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

  _getImage({ imageUrl }) {
    return this._getImageDataUrl({ imageUrl }).then(
      dataUrl =>
        new Promise(resolve => {
          const image = new Image();
          image.addEventListener("load", _ => resolve(image));
          image.src = dataUrl;
        })
    );
  }

  draw({
    device,
    imageUrl,
    headline,
    headlineSize,
    colourCode,
    standfirst,
    standfirstSize,
    isTop,
    svgHeadline
  }) {
    if (!imageUrl) {
      return Promise.reject("no-image");
    }

    return this._getImage({ imageUrl }).then(image => {
      const [deviceWidth, deviceHeight] = Config.dimensions[device];

      const { width, height, scale } = this._getCanvasDimensions({
        deviceWidth,
        deviceHeight,
        imageHeight: image.height,
        imageWidth: image.width
      });

      const canvas = this._getNewCanvas({ width, height });

      const canvasContext = canvas.getContext("2d");
      canvasContext.fillStyle = colourCode;

      this._drawImage({ canvasContext, image, device });

      const splitHeadline = !headline
        ? []
        : this._splitTextIntoLines({
            canvasContext,
            maxWidth: Config.headline.maxWidth * scale,
            text: headline,
            font: Config.headline.font,
            fontSize: Config.headline.fontSize[headlineSize] * scale
          });

      const splitStandfirst = !standfirst
        ? []
        : this._splitTextIntoLines({
            canvasContext,
            maxWidth: Config.standfirst.maxWidth * scale,
            text: standfirst,
            font: Config.standfirst.font,
            fontSize: Config.standfirst.fontSize[standfirstSize] * scale
          });

      const headlineHeight =
        (splitHeadline.length * Config.headline.lineHeight[headlineSize] +
          Config.padding) *
        scale;
      const standfirstHeight =
        splitStandfirst.length *
        Config.standfirst.lineHeight[standfirstSize] *
        scale;

      if (svgHeadline) {
        return this._drawSvg({ canvasContext, svg: svgHeadline, scale }).then(
          _ => {
            const standfirstOffset =
              canvas.height - standfirstHeight - Config.padding * scale;

            this._drawText({
              canvasContext,
              lines: splitStandfirst,
              font: Config.standfirst.font,
              fontSize: Config.standfirst.fontSize[standfirstSize] * scale,
              initialOffset: standfirstOffset
            });

            return canvas;
          }
        );
      }

      if (splitHeadline.length > 0) {
        const headlineOffset = isTop
          ? 0
          : canvas.height -
            headlineHeight -
            standfirstHeight -
            Config.padding * scale;

        this._drawText({
          canvasContext,
          lines: splitHeadline,
          font: Config.headline.font,
          fontSize: Config.headline.fontSize[headlineSize] * scale,
          lineHeight: Config.headline.lineHeight[headlineSize] * scale,
          initialOffset: headlineOffset
        });
      }

      if (splitStandfirst.length > 0) {
        const standfirstOffset = isTop
          ? headlineHeight
          : canvas.height - standfirstHeight - Config.padding * scale;

        this._drawText({
          canvasContext,
          lines: splitStandfirst,
          font: Config.standfirst.font,
          fontSize: Config.standfirst.fontSize[standfirstSize] * scale,
          lineHeight: Config.standfirst.lineHeight[standfirstSize] * scale,
          initialOffset: standfirstOffset
        });
      }

      return canvas;
    });
  }
}

export default CanvasCard;
