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

export default (props: {furniture?: Furniture, updateFurniture: (newFurniture: Furniture) => void, updateOriginalImageData: (imageData: object) => void }) => {
  const swatchSelectOptions = Object.keys(Config.swatches)
  const [position, setPostion] = useState("top");

  function update(field: string, value: any) {
    const newFurniture = {...props.furniture, [field]: value} as Furniture;
    props.updateFurniture(newFurniture);
  }

  function updatePostion(postion: string, value: any){
    setPostion(postion);
    update('position', value);
  }

  return (
    <div className="card-builder-left">
      <form className="card-builder-form">
        <ImageSelect updateImageUrl={imageUrl => update('imageUrl', imageUrl)} updateOriginalImageData={props.updateOriginalImageData} />

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
            <input
              type="radio"
              id="headlineSmall"
              name="headlineSize"
              value={HeadlineSize.Small}
              checked={props.furniture?.headlineSize === HeadlineSize.Small}
              onChange={event => update('headlineSize', event.target.value)}
            />
            <label htmlFor="headlineSmall">Small</label>

            <input
              type="radio"
              id="headlineMedium"
              name="headlineSize"
              value={HeadlineSize.Medium}
              checked={props.furniture?.headlineSize === HeadlineSize.Medium}
              onChange={event => update('headlineSize', event.target.value)}
            />
            <label htmlFor="headlineMedium">Medium</label>

            <input
              type="radio"
              id="headlineLarge"
              name="headlineSize"
              value={HeadlineSize.Large}
              checked={props.furniture?.headlineSize === HeadlineSize.Large}
              onChange={event => update('headlineSize', event.target.value)}
            />
            <label htmlFor="headlineLarge">Large</label>
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
            <input
              type="radio"
              id="standfirstSmall"
              name="standfirstSize"
              value={StandfirstSize.Small}
              checked={props.furniture?.standfirstSize === StandfirstSize.Small}
              onChange={event => update('standfirstSize', event.target.value)}
            />
            <label htmlFor="standfirstSmall">Small</label>

            <input
              type="radio"
              id="standfirstMedium"
              name="standfirstSize"
              value={StandfirstSize.Medium}
              checked={props.furniture?.standfirstSize === StandfirstSize.Medium}
              onChange={event => update('standfirstSize', event.target.value)}
            />
            <label htmlFor="standfirstMedium">Medium</label>
          </fieldset>
          <ColourPicker id="standfirst" colour={props.furniture?.standfirstColour} update={colour => update('standfirstColour', colour)}/>
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
          <ColourPicker id="byline" colour={props.furniture?.bylineColour} update={colour => update('bylineColour', colour)}/>
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
              onChange={event => updatePostion("top", 0)}
            />
            <label htmlFor="positionTop">Top</label>

            <input
              type="radio"
              id="positionMiddle"
              name="positionValue"
              value="middle"
              checked={position == "middle"}
              onChange={event => updatePostion("middle", 40)}
            />
            <label htmlFor="positionMiddle">Middle</label>
            <input
              type="radio"
              id="positionBottom"
              name="positionValue"
              value="bottom"
              checked={position == "bottom"}
              onChange={event => updatePostion("bottom", 100)}
            />
            <label htmlFor="positionBottom">Bottom</label>
            <br/>
            <div>
              <input
                type="radio"
                id="positionCustom"
                name="positionValue"
                checked={position == "custom"}
                onChange={() => updatePostion("custom", 50)}
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
                onChange={event => updatePostion("custom", event.target.value)}
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
    </div>
  )
}
