import config from './config'
import { Furniture } from '../types/furniture'
import {  HeadlineSize, StandfirstSize } from "../enums/size"
import { Device } from "../enums/device"
import { BylineLocation } from '../enums/location'
import { FontWeight } from '../enums/font-weight'

export default function(): Furniture {
  return {
    headline: undefined,
    headlineSize: HeadlineSize.Small,
    headlineColour: config.swatches.simple.white,
    kicker: undefined,
    kickerColour: config.swatches.simple.white,
    standfirst: undefined,
    standfirstSize: StandfirstSize.Small,
    standfirstColour: config.swatches.simple.white,
    standfirstWeight: FontWeight.Regular,
    byline: undefined,
    bylineColour: config.swatches.simple.white,
    bylineLocation: BylineLocation.Headline,
    position: 0,
    device: Device.Mobile,
    imageUrl: undefined,
  }
}
