/** @jsx jsx */
import { jsx } from '@emotion/core'
import config from "../utils/config"
import { useState } from 'react';

export default(props: {id: string, colour: string, update: (colour: string) => void}) => {

  const [swatch, setSwatch] = useState(Object.keys(config.swatches).find(() => true));

  function updateSwatch(event) {
    props.update(Object.values(config.swatches[event.target.value]).find(() => true) as string);
    setSwatch(event.target.value);
  }

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

  return(
    <div>
      <label>
      Swatch
        <select css={{textTransform: 'capitalize'}} name="swatch" value={swatch} onChange={updateSwatch}>
          {Object.keys(config.swatches).map(swatch => (
            <option value={swatch} key={swatch}>{swatch}</option>
          ))}
        </select>
      </label>
    <fieldset className="colour">
      <legend>Colour</legend>
      <div className="coloursBySwatch">
        {Object.entries<string>(config.swatches[swatch]).map(([name, value]) => (
        <div key={name} css={{display: "inline-block"}}>
          <input
          type="radio"
          id={`${props.id}_${name}`}
          name={`${props.id}_${name}`}
          onChange={() => props.update(value)}
          checked={props.colour == value}/>
          <label
          htmlFor={`${props.id}_${name}`}
          css={{backgroundColor: value, textTransform: 'capitalize', color: contrastTextColor(value)}}
          className="swatchcolour">{name}</label>
        </div>
        ))}
      </div>
    </fieldset>
  </div>);
}
