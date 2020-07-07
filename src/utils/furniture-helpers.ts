import config from './config'
import { Furniture } from '../types/furniture'
import {  HeadlineSize, StandfirstSize } from "../types/size"
import { Device } from "../types/device"

export default function(): Furniture {
  return {
    headline: "",
    headlineSize: HeadlineSize.Small,
    headlineColour: config.swatches.simple.white,
    standfirst: "",
    standfirstSize: StandfirstSize.Small,
    position: 0,
    device: Device.Mobile,
    imageUrl: "",
  }
}

