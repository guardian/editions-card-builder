import GridModal from './grid/modal';
import drawCanvas from './canvas';
import Config from './config';

const form = document.querySelector('.card-builder-form');
const downloadButton = document.querySelector('.download-button');
const customColourInput = document.getElementById('customColour');
const destination = document.querySelector(".card-builder-right");

downloadButton.addEventListener('click', () => {
  const canvas = document.querySelector("canvas");
  const image = canvas.toDataURL("image/png");
  document.write(`<img src="${image}"/>`);
});

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
  customColourInput.style.display = isCustomColour ? 'block' : 'none';
  const colourCode = isCustomColour ? customColour : Config.colours[colour];

  drawCanvas({
    device,
    imageUrl,
    headline,
    headlineSize,
    standfirst,
    standfirstSize,
    colourCode,
    isTop: position === 'top',
    svgHeadline
  }).then(canvas => {
    if (destination.firstChild) {
      destination.firstChild.remove();
    }

    destination.appendChild(canvas);
    downloadButton.disabled = false;
  }).catch(e => console.error(e));
});

new GridModal({
  gridUrl: 'https://media.test.dev-gutools.co.uk',
  triggerEl: document.querySelector('.image-select'),
  targetInput: document.getElementById('imageUrl')
});
