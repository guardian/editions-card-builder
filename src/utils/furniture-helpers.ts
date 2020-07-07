import config from './config'
import { Furniture } from '../types/furniture'
import { Size } from "../types/size"
import { Device } from "../types/device"

export default function(): Furniture {
  return {
    headline: "",
    headlineSize: Size.Small,
    headlineColour: config.swatches.simple.white,
    standfirst: "",
    standfirstSize: Size.Small,
    position: 0,
    device: Device.Mobile,
    imageUrl: "",
  }
}

