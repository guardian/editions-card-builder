/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from "./header"
import Form from "./form"
import Canvas from "./canvas"
import * as React from 'react'
import { Furniture } from '../types/furniture'
import config from '../utils/config'

interface AppState {
  canvasBlob?: Blob
  furniture?: Furniture
  originalImageData?: object
}


class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      canvasBlob: undefined,
      furniture: {
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
  }

  updateCanvasBlob = (newBlob) => {
    console.log("updating with a new blob")
    this.setState({
      canvasBlob: newBlob
    })
  }

  updateFurniture = (newFurniture: Furniture) => {
    console.log("updating with new furniture", newFurniture)
    this.setState({
      furniture: newFurniture
    })
  }

  updateOriginalImageData = (imageData: object) => {
    this.setState({
      originalImageData: imageData
    })
  }

  render() {
    return <div>
      <Header canvasBlob={this.state.canvasBlob} originalImageData={this.state.originalImageData} />
      <div className="card-builder">
        <Form furniture={this.state.furniture} updateFurniture={this.updateFurniture} updateOriginalImageData={this.updateOriginalImageData}/>
        <Canvas furniture={this.state.furniture} update={this.updateCanvasBlob}/>
      </div>
    </div>;
  }
}

export default App;
