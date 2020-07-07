/** @jsx jsx */
import { jsx } from '@emotion/core'
import config from "../utils/config"
import { useState, ChangeEvent } from 'react';

export default(props: {id: string, colour?: string, update: (colour: string) => void}) => {

  const [swatch, setSwatch] = useState(Object.keys(config.swatches).find(() => true) as string);
  const [custom, setCustom] = useState(false);

  function updateSwatch(event: ChangeEvent<HTMLSelectElement>) {
    let swatch = findSwatch(event.target.value);
    let colour = Object.values(swatch).find(() => true) as string
    props.update(colour);
    setSwatch(event.target.value);
  }

  function findSwatch(name: string){
    return Object.entries(config.swatches).find(([key, value]) => key == name)?.pop() || {};
  }

  function updateColour(colour: any){
    props.update(colour);
    setCustom(false);
  }

  function contrastTextColor(hex: String) {
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
        {Object.entries<string>(findSwatch(swatch)).map(([name, value]) => (
        <div key={name} css={{display: "inline-block"}}>
          <input
          type="radio"
          id={`${props.id}_${name}`}
          name={`${props.id}_${name}`}
          onChange={() => updateColour(value)}
          checked={props.colour == value}/>
          <label
          htmlFor={`${props.id}_${name}`}
          css={{backgroundColor: value, textTransform: 'capitalize', color: contrastTextColor(value)}}
          className="swatchcolour">{name}</label>
        </div>
        ))}
      </div>
      <div>
        <input
          type="radio"
          id="colourCustom"
          name="colour"
          value="custom"
          checked={custom == true}
          onChange={() => setCustom(true)}
        />
        <label htmlFor="colourCustom">Custom</label>
        <input
          id="customColour"
          name="customColour"
          type="text"
          value={props.colour}
          onChange={event => props.update(event.target.value)}
        />
      </div>
    </fieldset>
  </div>);
}
