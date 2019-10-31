import Config from "./config";

const DIMENSION_MULTIPLIER = 1.5;

class CanvasCard {
  constructor() {
    this.imageCache = new Map();
  }

  _getNewCanvas({ device }) {
    const [width, height] = Config.dimensions[device];
    const canvas = document.createElement("canvas");

    canvas.classList.add("card");
    canvas.width = width * DIMENSION_MULTIPLIER;
    canvas.height = height * DIMENSION_MULTIPLIER;

    return canvas;
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
        return !this._doesTextFit({ canvasContext, maxWidth, text: newBuffer })
          ? { lines: [...lines, buffer], buffer: char }
          : { lines: lines, buffer: newBuffer };
      },
      { buffer: "", lines: [] }
    );

    return [...measured.lines, measured.buffer];
  }

  _drawText({ canvasContext, lines, fontSize, font, initialOffset }) {
    canvasContext.font = `${fontSize}px ${font}`;

    lines.forEach((line, i) => {
      const yOffset = initialOffset + fontSize * (i + 1);
      canvasContext.fillText(line, Config.padding, yOffset);
    });
  }

  _drawSvg({ canvasContext, svg }) {
    return new Promise(resolve => {
      const image = new Image();
      image.width = Config.svgWidth;
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
      const canvas = this._getNewCanvas({ device });
      const canvasContext = canvas.getContext("2d");
      canvasContext.fillStyle = colourCode;

      this._drawImage({ canvasContext, image });

      const splitHeadline = !headline
        ? []
        : this._splitTextIntoLines({
            canvasContext,
            maxWidth: Config.headline.maxWidth,
            text: headline,
            font: Config.headline.font,
            fontSize: Config.headline.fontSize[headlineSize]
          });

      const splitStandfirst = !standfirst
        ? []
        : this._splitTextIntoLines({
            canvasContext,
            maxWidth: Config.standfirst.maxWidth,
            text: standfirst,
            font: Config.standfirst.font,
            fontSize: Config.standfirst.fontSize[standfirstSize]
          });

      const headlineHeight =
        splitHeadline.length * Config.headline.fontSize[headlineSize] +
        Config.padding;
      const standfirstHeight =
        splitStandfirst.length * Config.standfirst.fontSize[standfirstSize];

      if (svgHeadline) {
        return this._drawSvg({ canvasContext, svg: svgHeadline }).then(_ => {
          const standfirstOffset =
            canvas.height - standfirstHeight - Config.padding;

          this._drawText({
            canvasContext,
            lines: splitStandfirst,
            font: Config.standfirst.font,
            fontSize: Config.standfirst.fontSize[standfirstSize],
            initialOffset: standfirstOffset
          });

          return canvas;
        });
      }

      if (splitHeadline.length > 0) {
        const headlineOffset = isTop
          ? 0
          : canvas.height - headlineHeight - standfirstHeight - Config.padding;

        this._drawText({
          canvasContext,
          lines: splitHeadline,
          font: Config.headline.font,
          fontSize: Config.headline.fontSize[headlineSize],
          lineHeight: Config.headline.lineHeight[headlineSize],
          initialOffset: headlineOffset
        });
      }

      if (splitStandfirst.length > 0) {
        const standfirstOffset = isTop
          ? headlineHeight
          : canvas.height - standfirstHeight - Config.padding;

        this._drawText({
          canvasContext,
          lines: splitStandfirst,
          font: Config.standfirst.font,
          fontSize: Config.standfirst.fontSize[standfirstSize],
          lineHeight: Config.standfirst.lineHeight[standfirstSize],
          initialOffset: standfirstOffset
        });
      }

      return canvas;
    });
  }
}

export default CanvasCard;
