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
          css={{backgroundColor: value, textTransform: 'capitalize'}}
          className="swatchcolour">{name}</label>
        </div>
        ))}
      </div>
    </fieldset>
  </div>);
}
