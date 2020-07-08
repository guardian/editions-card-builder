import { Device } from "../enums/device";
import { HeadlineSize, StandfirstSize } from "../enums/size";

export interface Furniture {
  device: Device
  imageUrl: string
  headline: string
  headlineSize: HeadlineSize
  headlineColour: string
  standfirst: string
  standfirstSize: StandfirstSize
  position: number
}

