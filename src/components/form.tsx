/** @jsx jsx */
import { jsx } from '@emotion/core'
import Config from "../utils/config";
import { Furniture } from '../types/furniture';
import ColourPicker from "./colour-picker"
import ImageSelect from "./image-select"

export default (props: {furniture: Furniture, updateFurniture: (newFurniture: Furniture) => void}) => {
  const swatchSelectOptions = Object.keys(Config.swatches)

  function update(field: string, value: any) {
    const newFurniture = {...props.furniture, [field]: value} as Furniture;
    props.updateFurniture(newFurniture);
  }

  return (
    <div className="card-builder-left">
      <form className="card-builder-form">
        <ImageSelect update={imageUrl => update('imageUrl', imageUrl)} />

        <label htmlFor="headline">Headline</label>
        <textarea
          id="headline"
          name="headline"
          placeholder="headline..."
          value={props.furniture.headline}
          onChange={event => update('headline', event.target.value)}
        ></textarea>

      <fieldset>
        <legend>Headline Size</legend>
        <input
          type="radio"
          id="headlineSmall"
          name="headlineSize"
          value="small"
          checked={props.furniture.headlineSize === 'small'}
          onChange={event => update('headlineSize', event.target.value)}
        />
        <label htmlFor="headlineSmall">Small</label>

        <input
          type="radio"
          id="headlineMedium"
          name="headlineSize"
          value="medium"
          checked={props.furniture.headlineSize === 'medium'}
          onChange={event => update('headlineSize', event.target.value)}
        />
        <label htmlFor="headlineMedium">Medium</label>

        <input
          type="radio"
          id="headlineLarge"
          name="headlineSize"
          value="large"
          checked={props.furniture.headlineSize === 'large'}
          onChange={event => update('headlineSize', event.target.value)}
        />
        <label htmlFor="headlineLarge">Large</label>
      </fieldset>

      <ColourPicker id="headline" colour={props.furniture.headlineColour} update={colour => update('headlineColour', colour)}/>

      <label htmlFor="standfirst">Standfirst</label>
      <textarea
        id="standfirst"
        name="standfirst"
        placeholder="standfirst..."
        value={props.furniture.standfirst}
        onChange={event => update('standfirst', event.target.value)}
      ></textarea>

      <fieldset>
        <legend>Standfirst Size</legend>
        <input
          type="radio"
          id="standfirstSmall"
          name="standfirstSize"
          value="small"
          checked={props.furniture.standfirstSize === 'small'}
          onChange={event => update('standfirstSize', event.target.value)}
        />
        <label htmlFor="standfirstSmall">Small</label>

        <input
          type="radio"
          id="standfirstMedium"
          name="standfirstSize"
          value="medium"
          checked={props.furniture.standfirstSize === 'medium'}
          onChange={event => update('standfirstSize', event.target.value)}
        />
        <label htmlFor="standfirstMedium">Medium</label>
      </fieldset>

      <ColourPicker id="standfirst" colour={props.furniture.standfirstColour} update={colour => update('standfirstColour', colour)}/>

      <fieldset>
        <legend>Position</legend>
        <input
          type="radio"
          id="positionTop"
          name="positionValue"
          value={0}
          checked={props.furniture.position === 0}
          onChange={event => update('position', event.target.value)}
        />
        <label htmlFor="positionTop">Top</label>

        <input
          type="radio"
          id="positionMiddle"
          name="positionValue"
          value={40}
          checked={props.furniture.position === 40}
          onChange={event => update('position', event.target.value)}
        />
        <label htmlFor="positionMiddle">Middle</label>
        <input
          type="radio"
          id="positionBottom"
          name="positionValue"
          value={100}
          checked={props.furniture.position === 100}
          onChange={event => update('position', event.target.value)}
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
          onChange={event => update('device', event.target.value)}
        />
        <label htmlFor="deviceMobile">Mobile</label>

        <input
          type="radio"
          id="deviceTablet"
          name="device"
          value="tablet"
          checked={props.furniture.device === "tablet"}
          onChange={event => update('device', event.target.value)}
        />
        <label htmlFor="deviceTablet">Tablet</label>
      </fieldset>
    </form>
    </div>
  )
}
