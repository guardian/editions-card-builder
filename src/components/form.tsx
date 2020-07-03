/** @jsx jsx */
import { jsx } from '@emotion/core'
import CanvasCard from "../utils/canvas";
import Config from "../utils/config";
import debounce from "debounce";
import { Furniture } from '../types/furniture';
import { upload } from '../grid/upload';

export default (props: {furniture: Furniture, updateFurniture: (newFurniture: Furniture) => void}) => {
  const swatchSelectOptions = Object.keys(Config.swatches)

  function updateHeadline(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.headline = event.target.value;
    props.updateFurniture(newFurniture);
  }

  function updateHeadlineSize(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.headlineSize = event.target.value;
    props.updateFurniture(newFurniture);
  }

  function updateStandfirst(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.standfirst = event.target.value;
    props.updateFurniture(newFurniture);
  }

  function updateStandfirstSize(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.standfirstSize = event.target.value;
    props.updateFurniture(newFurniture);
  }

  function updatePosition(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.position = event.target.value;
    props.updateFurniture(newFurniture);
  }

  function updateDevice(event) {
    let newFurniture = Object.assign({}, props.furniture);
    newFurniture.device = event.target.value;
    props.updateFurniture(newFurniture);
  }

  return (
    <div className="card-builder-left">
      <form className="card-builder-form">
        <button type="button" className="image-select">Select image</button>
        <input id="imageUrl" type="hidden" name="imageUrl" />

        <label htmlFor="headline">Headline</label>
        <textarea
          id="headline"
          name="headline"
          placeholder="headline..."
          value={props.furniture.headline}
          onChange={updateHeadline}
        ></textarea>

      <fieldset>
        <legend>Headline Size</legend>
        <input
          type="radio"
          id="headlineSmall"
          name="headlineSize"
          value="small"
          checked={props.furniture.headlineSize === 'small'}
          onChange={updateHeadlineSize}
        />
        <label htmlFor="headlineSmall">Small</label>

        <input
          type="radio"
          id="headlineMedium"
          name="headlineSize"
          value="medium"
          checked={props.furniture.headlineSize === 'medium'}
          onChange={updateHeadlineSize}
        />
        <label htmlFor="headlineMedium">Medium</label>

        <input
          type="radio"
          id="headlineLarge"
          name="headlineSize"
          value="large"
          checked={props.furniture.headlineSize === 'large'}
          onChange={updateHeadlineSize}
        />
        <label htmlFor="headlineLarge">Large</label>
      </fieldset>

      <label htmlFor="standfirst">Standfirst</label>
      <textarea
        id="standfirst"
        name="standfirst"
        placeholder="standfirst..."
        value={props.furniture.standfirst}
        onChange={updateStandfirst}
      ></textarea>

      <fieldset>
        <legend>Standfirst Size</legend>
        <input
          type="radio"
          id="standfirstSmall"
          name="standfirstSize"
          value="small"
          checked={props.furniture.standfirstSize === 'small'}
          onChange={updateStandfirstSize}
        />
        <label htmlFor="standfirstSmall">Small</label>

        <input
          type="radio"
          id="standfirstMedium"
          name="standfirstSize"
          value="medium"
          checked={props.furniture.standfirstSize === 'medium'}
          onChange={updateStandfirstSize}
        />
        <label htmlFor="standfirstMedium">Medium</label>
      </fieldset>

      <fieldset>
        <legend>Position</legend>
        <input
          type="radio"
          id="positionTop"
          name="positionValue"
          value={0}
          checked={props.furniture.position === 0}
          onChange={updatePosition}
        />
        <label htmlFor="positionTop">Top</label>

        <input
          type="radio"
          id="positionMiddle"
          name="positionValue"
          value={40}
          checked={props.furniture.position === 40}
          onChange={updatePosition}
        />
        <label htmlFor="positionMiddle">Middle</label>
        <input
          type="radio"
          id="positionBottom"
          name="positionValue"
          value={100}
          checked={props.furniture.position === 100}
          onChange={updatePosition}
        />
        <label htmlFor="positionBottom">Bottom</label>
        {/* <br/>
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
        </div> */}

      </fieldset>

      <fieldset>
        <legend>Device</legend>
        <input
          type="radio"
          id="deviceMobile"
          name="device"
          value="mobile"
          checked={props.furniture.device === "mobile"}
          onChange={updateDevice}
        />
        <label htmlFor="deviceMobile">Mobile</label>

        <input
          type="radio"
          id="deviceTablet"
          name="device"
          value="tablet"
          checked={props.furniture.device === "tablet"}
          onChange={updateDevice}
        />
        <label htmlFor="deviceTablet">Tablet</label>
      </fieldset>

      {/* <label>
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

 */}
    </form>
    </div>
  )
}
