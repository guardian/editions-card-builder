import GridModal from "./grid/modal";
import CanvasCard from "./canvas";
import Config from "./config";
import GridUpload from "./grid/upload";
import debounce from "debounce";

const form = document.querySelector(".card-builder-form");
const downloadLink = document.getElementById("download");
const customColourInput = document.getElementById("customColour");
const destination = document.querySelector(".card-builder-right");
const uploadButton = document.getElementById("upload");

const canvasCard = new CanvasCard();

const { GRID_DOMAIN } = process.env;

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
      .then(_ => {
        uploadButton.innerText = "Uploaded";
        setTimeout(() => (uploadButton.innerText = "Upload"), 1000);
      });
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

  downloadLink.removeAttribute("href");
  uploadButton.disabled = true;

  canvasCard
    .draw({
      device,
      imageUrl,
      headline,
      headlineSize,
      standfirst,
      standfirstSize,
      colourCode,
      isTop: position === "top",
      svgHeadline
    })
    .then(canvas => {
      if (destination.firstChild) {
        destination.firstChild.remove();
      }

      destination.appendChild(canvas);

      const image = canvas.toDataURL("image/png");
      downloadLink.setAttribute("href", image);
      uploadButton.disabled = false;
    })
    .catch(e => console.error(e));
};

form.addEventListener("input", debounce(draw, 200));
