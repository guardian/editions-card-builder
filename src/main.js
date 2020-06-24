import GridModal from "./grid/modal";
import CanvasCard from "./canvas";
import Config from "./config";
import { upload as GridUpload } from "./grid/upload";
import debounce from "debounce";
import download from "downloadjs";

const form = document.querySelector(".card-builder-form");
const coloursBySwatch = document.querySelector(".coloursBySwatch")
const downloadButton = document.getElementById("download");
const customColourInput = document.getElementById("customColour");
const customPositionInput = document.getElementById("customPosition");
const destination = document.querySelector(".card-builder-right");
const uploadButton = document.getElementById("upload");
const gridLink = document.getElementById("gridLink");

const canvasCard = new CanvasCard();

const GRID_DOMAIN = process.env.GRID_DOMAIN;

const gridModal = new GridModal({
  gridDomain: GRID_DOMAIN,
  triggerEl: document.querySelector(".image-select"),
  targetInput: document.getElementById("imageUrl")
});

uploadButton.addEventListener("click", _ => {
  uploadButton.disabled = true;
  uploadButton.innerText = "Uploading";
  const canvas = document.querySelector("canvas");

  canvas.toBlob(blob => {
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsArrayBuffer(blob);
    })
      .then(arrayBuffer =>
        GridUpload({
          gridDomain: GRID_DOMAIN,
          image: new Uint8Array(arrayBuffer),
          originalImage: gridModal.getApiResponse()
        })
      )
      .then(apiResponse => {
        const imageUrl = apiResponse.links.find(({ rel }) => rel === "ui:image")
          .href;
        gridLink.href = imageUrl;
        uploadButton.innerText = "Uploaded";
      })
      .catch(error => {
        uploadButton.innerText = "Upload";
        uploadButton.disabled = false;
        console.error(error);
        throw error;
      });
  });
});

downloadButton.addEventListener("click", _ => {
  downloadButton.disabled = true;

  const canvas = document.querySelector("canvas");

  canvas.toBlob(blob => {
    download(blob, "image.png", "image/png");
  });
});


function contrastTextColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const brightness =
      parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16)
    if (brightness < 300)
      return '#ffffff'
    else
      return '#000000'
}

const addColours = () => {

  let first=true;
  for (let swatch in Config.swatches) {
    const coloursBySwatchChild = document.createElement("div")
    coloursBySwatchChild.className=`swatchset swatch-${swatch}`
    if (first)
      coloursBySwatchChild.style.display="inline-block"
    else
      coloursBySwatchChild.style.display="none"

    for (var colourKey in Config.swatches[swatch]) {
      const colourKeyDisplay = colourKey.charAt(0).toUpperCase() + colourKey.slice(1);

      const id = "colour-" + colourKey + "-" + swatch

      const colourInputElement = document.createElement("input")
      colourInputElement.type="radio"
      colourInputElement.id=id
      colourInputElement.name="colour"
      colourInputElement.value=colourKey
      colourInputElement.checked = first;
      coloursBySwatchChild.appendChild(colourInputElement)

      const colourLabelElement = document.createElement("label")
      colourLabelElement.htmlFor=id
      colourLabelElement.textContent = colourKeyDisplay
      colourLabelElement.className="swatchcolour"
      colourLabelElement.style.backgroundColor=Config.swatches[swatch][colourKey]
      colourLabelElement.style.color=contrastTextColor(Config.swatches[swatch][colourKey])
      coloursBySwatchChild.appendChild(colourLabelElement)
      first=false;
    }
    coloursBySwatch.appendChild(coloursBySwatchChild)
  }
}

const draw = () => {
  const formData = new FormData(form);

  const {
    imageUrl,
    headline,
    headlineSize,
    standfirst,
    standfirstSize,
    swatch,
    colour,
    customColour,
    positionValue,
    customPosition,
    device
  } = Object.fromEntries(formData);

  var activeSwatchset = document.querySelector(".swatch-" + swatch)

  // If we have just switched swatch, use the first child, otherwise the last value.
  const activeColour = activeSwatchset.style.display == "none" ? activeSwatchset.firstChild.value : colour

  // Show/hide colour selectors according to chosen swatch
  if (activeSwatchset.style.display == "none") {
     // swatch has changed
    const allColours = document.querySelectorAll(".swatchset")
    for (let node of allColours) node.style.display="none";
    activeSwatchset.style.display="inline-block";
    const activeColourInput = activeSwatchset.firstChild
    activeColourInput.checked=true
  }

  // show custom colour input if `custom` is selected
  const colourCode = activeColour === "custom" ? customColour : Config.swatches[swatch][activeColour];

  // show custom position input if `custom` is selected
  const position = positionValue === "-1" ? customPosition : parseInt(positionValue);

  uploadButton.disabled = true;
  downloadButton.disabled = true;
  gridLink.removeAttribute("href");

  canvasCard
    .draw({
      device,
      imageUrl,
      headline,
      headlineSize,
      standfirst,
      standfirstSize,
      colourCode,
      position
    })
    .then(canvas => {
      if (destination.firstChild) {
        destination.firstChild.remove();
      }
      destination.appendChild(canvas);
      uploadButton.disabled = false;
      downloadButton.disabled = false;
    })
    .catch(e => console.error(e));
}

addColours()

form.addEventListener("input", debounce(draw, 200));
customPositionInput.addEventListener("change", debounce(draw, 200));
