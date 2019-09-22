import Config from './config';

const DIMENSION_MULTIPLIER = 1.5;

function getNewCanvas({device}) {
  const [width, height] = Config.dimensions[device];
  const canvas = document.createElement('canvas');

  canvas.classList.add('card');
  canvas.width = width * DIMENSION_MULTIPLIER;
  canvas.height = height * DIMENSION_MULTIPLIER;

  return canvas;
}

function drawImage({canvasContext, image}) {
  const x = 0;
  const y = 0;
  const xOffset = 0.5;
  const yOffset = 0.5;

  const canvasWidth = canvasContext.canvas.width;
  const canvasHeight = canvasContext.canvas.height;
  const imageWidth = image.width;
  const imageHeight = image.height;

  const ratio = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

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

function doesTextFit({canvasContext, maxWidth, text}) {
  const measure = canvasContext.measureText(text);
  return measure.width < maxWidth;
}

function splitStringIntoLines({canvasContext, maxWidth, string}) {
  const measured = string.split('').reduce(({buffer, lines}, char) => {
    const newBuffer = buffer + char;
    return !doesTextFit({canvasContext, maxWidth, text: newBuffer})
      ? { lines: [...lines, buffer], buffer: char }
      : { lines: lines, buffer: newBuffer }
  }, { buffer: '', lines: [] });

  return [...measured.lines, measured.buffer];
}

function drawHeadline({canvasContext, headline, headlineSize}) {
  const headlineFontSize = Config.headline.fontSize[headlineSize];
  canvasContext.font = `${headlineFontSize}px ${Config.headline.font}`;

  const lines = splitStringIntoLines({
    canvasContext,
    maxWidth: Config.headline.maxWidth,
    string: headline
  });

  lines.forEach((line, i) => {
    const yOffset = headlineFontSize * (i + 1);
    canvasContext.fillText(line, 10, yOffset);
  });
}

function draw({device, imageUrl, headline, headlineSize, colourCode}) {
  if(!imageUrl) {
    return Promise.reject('no-image');
  }

  const canvas = getNewCanvas({device});
  const canvasContext = canvas.getContext('2d');

  const image = new Image();
  image.src = imageUrl;

  return new Promise(resolve => {
    image.addEventListener('load', _ => {
      drawImage({canvasContext, image});
      canvasContext.fillStyle = colourCode;
      drawHeadline({canvasContext, headline, headlineSize});

      resolve(canvas);
    });
  });
}

export default draw;
