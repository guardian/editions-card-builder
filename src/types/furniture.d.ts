import { Device } from "../enums/device";
import { HeadlineSize, StandfirstSize } from "../enums/size";

export interface Furniture {
  device: Device
  imageUrl: string | undefined
  headline: string | undefined
  headlineSize: HeadlineSize
  headlineColour: string
  kicker: string | undefined
  kickerColour: string
  standfirst: string | undefined
  standfirstSize: StandfirstSize
  standfirstColour: string
  byline: string | undefined
  bylineColour: string
  position: number
}

