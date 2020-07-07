import { Furniture } from "../types/furniture";

import config from './config'


export default function(): Furniture{
  return {
    headline: "",
    headlineSize: "small",
    headlineColour: config.swatches.simple.white,
    standfirst: "",
    standfirstSize: "small",
    position: 0,
    device: "mobile",
    imageUrl: "",
  }
}

