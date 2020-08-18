import { Device } from "../enums/device";
import { HeadlineSize, StandfirstSize } from "../enums/size";
import { BylineLocation } from "../enums/location";
import { FontWeight } from "../enums/font-weight";

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
  standfirstWeight: FontWeight
  byline: string | undefined
  bylineColour: string
  bylineLocation: BylineLocation
  position: number
}
