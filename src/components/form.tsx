/** @jsx jsx */
import { jsx } from '@emotion/core'

export default function(){

  function sayHello(){
    console.log("Hello")
  }

  return (
    <div className="card-builder-left">
        <form className="card-builder-form" onChange={e => sayHello()}>
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
