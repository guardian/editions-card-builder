const DIMENSION_MULTIPLIER = 1.5;

const DIMENSIONS = {
  mobile: [350, 540],
  tablet: [650, 725]
}

function getNewCanvas({device}) {
  const [width, height] = DIMENSIONS[device];
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

function draw({device, imageUrl}) {
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
      resolve(canvas);
    });
  });
}

export default draw;
