import { Device } from "./device";
import { Size } from "./size";

export interface Furniture {
  device: Device
  imageUrl: string
  headline: string
  headlineSize: Size
  headlineColour: string
  standfirst: string
  standfirstSize: Size
  position: number
}

