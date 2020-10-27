/** @jsx jsx */
import { jsx } from '@emotion/core'
import Config from "../utils/config";
import ColourPicker from "./colour-picker"
import ImageSelect from "./image-select"
import Collapsible from "./collapsible"
import { useState } from 'react'
import { Furniture } from '../types/furniture';
import { HeadlineSize, StandfirstSize } from '../enums/size';
import { Device } from '../enums/device';
import SizePicker from './size-picker';
import { BylineLocation } from '../enums/location';
import { FontWeight } from '../enums/font-weight';

export default (props: {furniture?: Furniture, updateFurniture: (newFurniture: Furniture) => void, updateOriginalImageData: (imageData: object) => void }) => {
  const swatchSelectOptions = Object.keys(Config.swatches)
  const [position, setPosition] = useState("top");

  function update(field: string, value: any) {
    const newFurniture = {...props.furniture, [field]: value} as Furniture;
    props.updateFurniture(newFurniture);
  }

  function updatePosition(position: string, value: any){
    setPosition(position);
    update('position', value);
  }

  return (
    <div className="card-builder-left">
      <form className="card-builder-form">
        <ImageSelect device={props.furniture?.device} updateImageUrl={imageUrl => update('imageUrl', imageUrl)} updateOriginalImageData={props.updateOriginalImageData} />

        <Collapsible name="Headline">
          <label htmlFor="headline">Text</label>
          <textarea
            id="headline"
            name="headline"
            placeholder="headline..."
            value={props.furniture?.headline}
            onChange={event => update('headline', event.target.value)}
          />

          <fieldset>
            <legend>Size</legend>
            <SizePicker
              id="headlineSize"
              sizes={HeadlineSize}
              chosenSize={props.furniture?.headlineSize}
              update={size => update('headlineSize', size)}
            />
          </fieldset>

          <ColourPicker id="headline" colour={props.furniture?.headlineColour} update={colour => update('headlineColour', colour)}/>
        </Collapsible>

        <Collapsible name="Kicker">
          <label htmlFor="kicker">Text</label>
          <input
            type="text"
            id="kicker"
            name="kicker"
            placeholder="kicker..."
            value={props.furniture?.kicker || ""}
            onChange={event => update('kicker', event.target.value)}
          />

          <ColourPicker id="kicker" colour={props.furniture?.kickerColour} update={colour => update('kickerColour', colour)}/>
        </Collapsible>

        <Collapsible name="Byline">
          <label htmlFor="byline">Text</label>
          <textarea
            id="byline"
            name="byline"
            placeholder="byline..."
            value={props.furniture?.byline || ""}
            onChange={event => update('byline', event.target.value)}
          />

          <fieldset>
            <legend>Locate under</legend>
            <input
              type="radio"
              id="locationHeadline"
              name="locationValue"
              value={BylineLocation.Headline}
              checked={props.furniture?.bylineLocation == BylineLocation.Headline}
              onChange={event => update("bylineLocation", event.target.value)}
            />
            <label htmlFor="locationHeadline">Headline</label>
            <input
              type="radio"
              id="locationStandfirst"
              name="locationValue"
              value={BylineLocation.Standfirst}
              checked={props.furniture?.bylineLocation == BylineLocation.Standfirst}
              onChange={event => update("bylineLocation", event.target.value)}
            />
            <label htmlFor="locationStandfirst">Standfirst</label>
          </fieldset>

          <ColourPicker id="byline" colour={props.furniture?.bylineColour} update={colour => update('bylineColour', colour)}/>
        </Collapsible>

        <Collapsible name="Standfirst">
          <label htmlFor="standfirst">Text</label>
          <textarea
            id="standfirst"
            name="standfirst"
            placeholder="standfirst..."
            value={props.furniture?.standfirst}
            onChange={event => update('standfirst', event.target.value)}
          />

          <fieldset>
            <legend>Size</legend>
            <SizePicker
              id="standfirstSize"
              sizes={StandfirstSize}
              chosenSize={props.furniture?.standfirstSize}
              update={size => update('standfirstSize', size)}
            />
          </fieldset>

          <fieldset>
            <legend>Weight</legend>
            <input
              type="radio"
              id="regularStandfirst"
              name="standfirstWeight"
              value={FontWeight.Regular}
              checked={props.furniture?.standfirstWeight == FontWeight.Regular}
              onChange={event => update("standfirstWeight", event.target.value)}
            />
            <label htmlFor="regularStandfirst">Regular</label>
            <input
              type="radio"
              id="boldStandfirst"
              name="standfirstWeight"
              value={FontWeight.Bold}
              checked={props.furniture?.standfirstWeight == FontWeight.Bold}
              onChange={event => update("standfirstWeight", event.target.value)}
            />
            <label htmlFor="boldStandfirst">Bold</label>
          </fieldset>

          <ColourPicker id="standfirst" colour={props.furniture?.standfirstColour} update={colour => update('standfirstColour', colour)}/>
        </Collapsible>

        <Collapsible name="Position">
          <fieldset>
            <legend>Position</legend>
            <input
              type="radio"
              id="positionTop"
              name="positionValue"
              value="top"
              checked={position == "top"}
              onChange={event => updatePosition("top", 0)}
            />
            <label htmlFor="positionTop">Top</label>

            <input
              type="radio"
              id="positionMiddle"
              name="positionValue"
              value="middle"
              checked={position == "middle"}
              onChange={event => updatePosition("middle", 40)}
            />
            <label htmlFor="positionMiddle">Middle</label>
            <input
              type="radio"
              id="positionBottom"
              name="positionValue"
              value="bottom"
              checked={position == "bottom"}
              onChange={event => updatePosition("bottom", 100)}
            />
            <label htmlFor="positionBottom">Bottom</label>
            <br/>
            <div>
              <input
                type="radio"
                id="positionCustom"
                name="positionValue"
                checked={position == "custom"}
                onChange={() => updatePosition("custom", 50)}
                value="custom"
              />
              <label htmlFor="positionCustom">Custom</label>
              <input
                id="customPosition"
                name="customPosition"
                type="range"
                value={props.furniture?.position}
                min="1"
                max="99"
                onChange={event => updatePosition("custom", event.target.value)}
              />
            </div>

          </fieldset>
        </Collapsible>

        <Collapsible name="Device">
          <fieldset>
            <legend>Device</legend>
            <input
              type="radio"
              id="deviceMobile"
              name="device"
              value={Device.Mobile}
              checked={props.furniture?.device === Device.Mobile}
              onChange={event => update('device', event.target.value)}
            />
            <label htmlFor="deviceMobile">Mobile</label>

            <input
              type="radio"
              id="deviceTablet"
              name="device"
              value={Device.Tablet}
              checked={props.furniture?.device === Device.Tablet}
              onChange={event => update('device', event.target.value)}
            />
            <label htmlFor="deviceTablet">Tablet</label>
          </fieldset>
        </Collapsible>
    </form>
    <div>
      <p>Note: Shaded/striped section of image is likely to be cropped on wider screen devices</p>
    </div>
    </div>
  )
}
