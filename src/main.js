import GridModal from './grid/modal';
import CanvasCard from './canvas';
import Config from './config';

const form = document.querySelector('.card-builder-form');
const downloadLink = document.querySelector('#download');
const customColourInput = document.getElementById('customColour');
const destination = document.querySelector(".card-builder-right");

const canvasCard = new CanvasCard();

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
  customColourInput.style.display = isCustomColour ? 'inline-block' : 'none';
  const colourCode = isCustomColour ? customColour : Config.colours[colour];

  canvasCard.draw({
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

    const image = canvas.toDataURL("image/png");
    downloadLink.href = image;
  }).catch(e => console.error(e));
});

new GridModal({
  gridUrl: process.env.GRID_URL,
  triggerEl: document.querySelector('.image-select'),
  targetInput: document.getElementById('imageUrl')
});
