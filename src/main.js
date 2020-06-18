import GridModal from "./grid/modal";
import CanvasCard from "./canvas";
import Config from "./config";
import { upload as GridUpload } from "./grid/upload";
import debounce from "debounce";
import download from "downloadjs";

const form = document.querySelector(".card-builder-form");
const downloadButton = document.getElementById("download");
const customColourInput = document.getElementById("customColour");
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
const draw = () => {
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
  customColourInput.style.display = isCustomColour ? "inline-block" : "none";
  const colourCode = isCustomColour ? customColour : Config.colours[colour];

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
      position,
      svgHeadline
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
};

form.addEventListener("input", debounce(draw, 200));
