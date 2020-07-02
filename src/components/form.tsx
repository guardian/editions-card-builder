/** @jsx jsx */
import { jsx } from '@emotion/core'
import CanvasCard from "../utils/canvas";
import Config from "../utils/config";
import debounce from "debounce";

export default function(){
  const form = document.querySelector(".card-builder-form") as HTMLFormElement;
  const coloursBySwatch = document.querySelector(".coloursBySwatch")

  const customColourInput = document.getElementById("customColour");
  const customPositionInput = document.getElementById("customPosition");
  const destination = document.querySelector(".card-builder-right");

  const canvasCard = new CanvasCard();

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

    var activeSwatchset = document.querySelector(".swatch-" + swatch) as HTMLElement

    // If we have just switched swatch, use the first child, otherwise the last value.
    const activeColour = activeSwatchset.style.display == "none" ? (activeSwatchset.firstChild as HTMLInputElement).value : colour

    // Show/hide colour selectors according to chosen swatch
    if (activeSwatchset.style.display == "none") {
       // swatch has changed
      const allColours = document.querySelectorAll(".swatchset")
      for (let node of allColours) (node as HTMLElement).style.display="none";
      activeSwatchset.style.display="inline-block";
      const activeColourInput = activeSwatchset.firstChild as HTMLInputElement
      activeColourInput.checked=true
    }

    // show custom colour input if `custom` is selected
    const colourCode = activeColour === "custom" ? customColour : Config.swatches[swatch.toString()][activeColour];

    // show custom position input if `custom` is selected
    const position = positionValue === "-1" ? customPosition : parseInt(positionValue.toString());

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

      })
      .catch(e => console.error(e));
  }

  addColours()

  form.addEventListener("input", debounce(draw, 200));
  // Needed so the event fires without releasing the mouse.
  customPositionInput.addEventListener("change", debounce(draw, 200));

  return (
    <div className="card-builder-left">
        <form className="card-builder-form" onChange={draw}>
          <button type="button" className="image-select">Select image</button>
          <input id="imageUrl" type="hidden" name="imageUrl" />

          <label htmlFor="headline">Headline</label>
          <textarea
            id="headline"
            name="headline"
            placeholder="headline..."
          ></textarea>

          <fieldset>
            <legend>Headline Size</legend>
            <input
              type="radio"
              id="headlineSmall"
              name="headlineSize"
              value="small"
              checked
            />
            <label htmlFor="headlineSmall">Small</label>

            <input
              type="radio"
              id="headlineMedium"
              name="headlineSize"
              value="medium"
            />
            <label htmlFor="headlineMedium">Medium</label>

            <input
              type="radio"
              id="headlineLarge"
              name="headlineSize"
              value="large"
            />
            <label htmlFor="headlineLarge">Large</label>
          </fieldset>

          <label>
            Swatch
            <select name="swatch">
              <option value="simple">Simple</option>
              <option value="brand">Brand</option>
              <option value="highlight">Highlight</option>
              <option value="news">News</option>
              <option value="opinion">Opinion</option>
              <option value="labs">Labs</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="sport">Sport</option>
              <option value="culture">Culture</option>
              <option value="neutral">Neutral</option>
              <option value="special">Special</option>
            </select>
          </label>

          <fieldset className="colour">
            <legend>Colour</legend>
            <div className="coloursBySwatch">

            </div>
            <div>
              <input
                type="radio"
                id="colourCustom"
                name="colour"
                value="custom"
              />
              <label htmlFor="colourCustom">Custom</label>
              <input
                id="customColour"
                name="customColour"
                type="text"
                value="hotpink"
              />

            </div>
          </fieldset>

          <label htmlFor="standfirst">Standfirst</label>
          <textarea
            id="standfirst"
            name="standfirst"
            placeholder="standfirst..."
          ></textarea>

          <fieldset>
            <legend>Standfirst Size</legend>
            <input
              type="radio"
              id="standfirstSmall"
              name="standfirstSize"
              value="small"
              checked
            />
            <label htmlFor="standfirstSmall">Small</label>

            <input
              type="radio"
              id="standfirstMedium"
              name="standfirstSize"
              value="medium"
            />
            <label htmlFor="standfirstMedium">Medium</label>
          </fieldset>

          <fieldset>
            <legend>Position</legend>
            <input
              type="radio"
              id="positionTop"
              name="positionValue"
              value="0"
              checked
            />
            <label htmlFor="positionTop">Top</label>

            <input
              type="radio"
              id="positionMiddle"
              name="positionValue"
              value="40"
            />
            <label htmlFor="positionMiddle">Middle</label>
            <input
              type="radio"
              id="positionBottom"
              name="positionValue"
              value="100"
            />
            <label htmlFor="positionBottom">Bottom</label>
            <br/>
            <div>
              <input
                type="radio"
                id="positionCustom"
                name="positionValue"
                value="-1"
              />
              <label htmlFor="positionCustom">Custom</label>
              <input
                id="customPosition"
                name="customPosition"
                type="range"
                value="40"
                min="1"
                max="99"
              />
            </div>

          </fieldset>

          <fieldset>
            <legend>Device</legend>
            <input
              type="radio"
              id="deviceMobile"
              name="device"
              value="mobile"
              checked
            />
            <label htmlFor="deviceMobile">Mobile</label>

            <input
              type="radio"
              id="deviceTablet"
              name="device"
              value="tablet"
            />
            <label htmlFor="deviceTablet">Tablet</label>
          </fieldset>
        </form>
      </div>
  )
}
