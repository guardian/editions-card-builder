/** @jsx jsx */
import { jsx } from '@emotion/core'
import config from "../utils/config"

export default () => {

  var state = {

  }

  return(
    <div>
      <label>
      Swatch
      <select css={{textTransform: 'capitalize'}} name="swatch">
        {Object.keys(config.swatches).map(swatch => (
          <option value={swatch} key={swatch}>{swatch}</option>
        ))}
      </select>
    </label>
    <fieldset className="colour">
      <legend>Colour</legend>
      <div className="coloursBySwatch">

      </div>
      {/* <div>
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
      </div> */}
    </fieldset>
  </div>);
}
