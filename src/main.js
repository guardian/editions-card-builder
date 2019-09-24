import GridModal from './grid/modal';
import canvas2000 from './canvas';
import Config from './config';

var button = document.querySelector("button.preview");
var headlineInput = document.querySelector(".input-headline");
var standfirstInput = document.querySelector(".input-standfirst");
var imageInput = document.querySelector("#grid-image");
var viewer = document.querySelector(".card-builder-right");
var fontSize = document.querySelector(".select-fontSize");
var fontColor = document.querySelector(".input-color");
var standySize = document.querySelector(".select-fontSize-stand");
var position = document.querySelector(".select-position");
var downloadButton = document.querySelector("button.download-button");
var colorOptions = document.querySelector(".color-options");
var svgInput = document.querySelector(".input-svg");
var device = document.querySelector(".image-platform-select");
var downLoadCanvas;
var hasDrawn = false;
var headlineWrap = false;
var standfirstWrap = false;

function draw() {
  var newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("class", "card");
  var canvas = newCanvas;
  if (device.value == "mobile") {
    canvas.width = 350 * 1.5;
    canvas.height = 540 * 1.5;
  } else {
    canvas.width = 650 * 1.5;
    canvas.height = 725 * 1.5;
  }
  canvas.style.border = "1px solid";
  var ctx = canvas.getContext("2d");

  function drawImageProp(canvasContext, img, x, y, canvasWidth, canvasHeight, xOffset, yOffset) {
    if (arguments.length === 2) {
      x = y = 0;
      canvasWidth = canvasContext.canvas.width;
      canvasHeight = canvasContext.canvas.height;
    }

    // default offset is center
    xOffset = typeof xOffset === "number" ? xOffset : 0.5;
    yOffset = typeof yOffset === "number" ? yOffset : 0.5;

    // keep bounds [0.0, 1.0]
    if (xOffset < 0) xOffset = 0;
    if (yOffset < 0) yOffset = 0;
    if (xOffset > 1) xOffset = 1;
    if (yOffset > 1) yOffset = 1;

    var imageWidth = img.width,
      imageHeight = img.height,
      ratio = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight),
      nw = imageWidth * ratio, // new prop. width
      nh = imageHeight * ratio, // new prop. height
      cx,
      cy,
      cw,
      ch,
      ar = 1;

    // decide which gap to fill
    if (nw < canvasWidth) ar = canvasWidth / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < canvasHeight) ar = canvasHeight / nh; // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = imageWidth / (nw / canvasWidth);
    ch = imageHeight / (nh / canvasHeight);

    cx = (imageWidth - cw) * xOffset;
    cy = (imageHeight - ch) * yOffset;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > imageWidth) cw = imageWidth;
    if (ch > imageHeight) ch = imageHeight;

    // fill image in dest. rectangle
    canvasContext.drawImage(img, cx, cy, cw, ch, x, y, canvasWidth, canvasHeight);
  }

  //function to check if text does wrap - returns true or false
  function wrapTextTest(context, text, x, y, maxWidth, lineHeight, identifier) {
    var words = text.split(" "),
      line = "",
      lineCount = 0,
      i,
      test,
      metrics;

    for (i = 0; i < words.length; i++) {
      test = words[i];
      metrics = context.measureText(test);
      while (metrics.width > maxWidth) {
        // Determine how much of the word will fit
        test = test.substring(0, test.length - 1);
        metrics = context.measureText(test);
      }
      if (words[i] != test) {
        words.splice(i + 1, 0, words[i].substr(test.length));
        words[i] = test;
      }

      test = line + words[i] + " ";
      metrics = context.measureText(test);

      if (metrics.width > maxWidth && i > 0) {
        line = words[i] + " ";
        y += lineHeight;
        lineCount++;
        identifier = true;
        console.log(identifier);
      } else {
        line = test;
      }
    }

    return identifier;
  }

  // function to write text over multiple lines
  function wrapText(context, text, x, y, maxWidth, lineHeight, identifier) {
    var words = text.split(" "),
      line = "",
      lineCount = 0,
      i,
      test,
      metrics;

    for (i = 0; i < words.length; i++) {
      test = words[i];
      metrics = context.measureText(test);
      while (metrics.width > maxWidth) {
        // Determine how much of the word will fit
        test = test.substring(0, test.length - 1);
        metrics = context.measureText(test);
      }
      if (words[i] != test) {
        words.splice(i + 1, 0, words[i].substr(test.length));
        words[i] = test;
      }

      test = line + words[i] + " ";
      metrics = context.measureText(test);

      if (metrics.width > maxWidth && i > 0) {
        context.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
        console.log(lineHeight, y);
        lineCount++;
        console.log(lineCount);
        identifier = true;
      } else {
        line = test;
      }
    }
    context.fillText(line, x, y);

    return identifier;
  }

  var background = new Image();
  background.src = imageInput.value;
  background.onload = function() {
    //Draw background image
    drawImageProp(ctx, background, 0, 0, canvas.width, canvas.height);
    var textPosition = fontSize.value.replace("px", "");
    var standPosition = standySize.value.replace("px", "");

    //Positioning
    if (position.value === "top" && fontSize.value == "80px") {
      var headlinePostion = parseInt(textPosition);
      var standyPostion = parseInt(textPosition) + 36;
    } else if (position.value === "top") {
      var headlinePostion = parseInt(textPosition);
      var standyPostion = parseInt(textPosition) + 2;
    } else {
      if (fontSize.value == "65px") {
        var headlinePostionWrap = canvas.height - parseInt(textPosition) * 2.5;
        var standyPostion = canvas.height - parseInt(textPosition) - 2;
      } else {
        var headlinePostion = canvas.height - parseInt(textPosition) * 2.6;
        var headlinePostionWrap = canvas.height - parseInt(textPosition) * 3.4;
        var standyPostion = canvas.height - parseInt(textPosition) - 1;
      }
    }

    //Headline
    ctx.font = fontSize.value + " Guardian Titlepiece";
    ctx.fillStyle = fontColor.value;
    if (
      position.value === "bottom" &&
      wrapTextTest(
        ctx,
        headlineInput.value,
        10,
        headlinePostion,
        350 * 1.4,
        parseInt(textPosition) + 4,
        headlineWrap
      ) === true &&
      svgInput.value.length == 0
    ) {
      headlineWrap = wrapText(
        ctx,
        headlineInput.value,
        10,
        headlinePostionWrap,
        350,
        parseInt(textPosition) + 2,
        headlineWrap
      );
    } else if (svgInput.value.length == 0) {
      headlineWrap = wrapText(
        ctx,
        headlineInput.value,
        10,
        headlinePostion,
        350,
        parseInt(textPosition),
        headlineWrap
      );
    } else {
      drawSVG(ctx, svgInput.value);
    }

    //Standfirst
    ctx.font = standySize.value + " Guardian Headline Full";
    ctx.fillStyle = fontColor.value;
    var standfirstAppend = standfirstInput.value + " ➺";
    console.log(standfirstAppend);

    //Standfirst (context, text, x, y, maxWidth, lineHeight, identifier)
    if (headlineWrap === true && position.value === "top") {
      wrapText(
        ctx,
        standfirstAppend,
        10,
        standyPostion * 2.4,
        300,
        parseInt(standPosition),
        standfirstWrap
      );
    } else if (headlineWrap === false && position.value === "top") {
      //makes the standfirst go to the bottom if there is an svg headline
      if (svgInput.value.length == 0) {
        wrapText(
          ctx,
          standfirstAppend,
          10,
          standyPostion,
          300,
          parseInt(standPosition),
          standfirstWrap
        );
      } else {
        standyPostion = canvas.height - parseInt(textPosition) - 1;
        wrapText(
          ctx,
          standfirstAppend,
          10,
          standyPostion,
          300,
          parseInt(standPosition),
          standfirstWrap
        );
      }
    } else if (headlineWrap === false && position.value === "bottom") {
      wrapText(
        ctx,
        standfirstAppend,
        10,
        standyPostion,
        300,
        parseInt(standPosition),
        standfirstWrap
      );
    } else if (headlineWrap === true && position.value === "bottom") {
      wrapText(
        ctx,
        standfirstAppend,
        10,
        standyPostion,
        300,
        parseInt(standPosition),
        standfirstWrap
      );
    }
  };

  viewer.appendChild(canvas);
  hasDrawn = true;
}

function drawSVG(ctx, svg) {
  console.log(svg);
  var pbx = new Image();
  pbx.width = 300;
  pbx.src = "data:image/svg+xml;base64," + window.btoa(svg);
  console.log(pbx);

  pbx.onload = function() {
    ctx.drawImage(pbx, 10, 10);
    console.log("drawsvg");
  };
}

function redraw() {
  headlineWrap = false;
  standfirstWrap = false;
  viewer.innerHTML = "";
  draw();
}

function build() {
  console.log("building...");
  button.addEventListener("click", function() {
    if (hasDrawn == false) {
      draw();
      downloadButton.classList.add("active");
    } else {
      redraw();
    }
  });
}

function download() {
  downloadButton.addEventListener("click", function() {
    downLoadCanvas = document.querySelector("canvas");
    if (hasDrawn != false) {
      var img = downLoadCanvas.toDataURL("image/png");
      document.write('<img src="' + img + '"/>');
    }
  });
}

function init() {
  build();
  download();
}
// init();

const form = document.querySelector('.card-builder-form');

form.addEventListener('input', e => {
  const formData = new FormData(form);

  const {
    imageUrl,
    headline,
    headlineSize,
    standfirst,
    standfirstSize,
    colour,
    customColour,
    position,
    device,
    svgHeadline
  } = Object.fromEntries(formData);

  const isCustomColour = colour === Config.colours.custom;

  // show custom colour input if `custom` is selected
  document.getElementById('customColour').style.display = isCustomColour ? 'block' : 'none';
  const colourCode = isCustomColour ? customColour : Config.colours[colour];

  canvas2000({device, imageUrl, headline, headlineSize, standfirst, standfirstSize, colourCode, isTop: position === 'top'}).then(canvas => {
    const destination = document.querySelector(".card-builder-right");

    if (destination.firstChild) {
      destination.firstChild.remove();
    }

    destination.appendChild(canvas);
  }).catch(e => console.error(e));
});

new GridModal({
  gridUrl: 'https://media.test.dev-gutools.co.uk',
  triggerEl: document.querySelector('.image-select'),
  targetInput: document.getElementById('imageUrl')
});
