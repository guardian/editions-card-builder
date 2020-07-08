import config from './config'
import { Furniture } from '../types/furniture'
import {  HeadlineSize, StandfirstSize } from "../enums/size"
import { Device } from "../enums/device"

export default function(): Furniture {
  return {
    headline: "",
    headlineSize: HeadlineSize.Small,
    headlineColour: config.swatches.simple.white,
    standfirst: "",
    standfirstSize: StandfirstSize.Small,
    standfirstColour: config.swatches.simple.white,
    position: 0,
    device: Device.Mobile,
    imageUrl: "",
  }
}

