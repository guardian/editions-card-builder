/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from "./header"
import Form from "./form"
import Canvas from "./canvas"
import * as React from 'react'
import { Furniture } from '../types/furniture'
import newFurniture from '../utils/furniture-helpers'


interface AppState {
  canvas?: HTMLCanvasElement
  furniture?: Furniture
  originalImageData?: object
}


class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      canvas: undefined,
      furniture: newFurniture()
    }
  }

  updateCanvasBlob = (newCanvas?: HTMLCanvasElement) => {
    this.setState({
      canvas: newCanvas
    })
  }

  updateFurniture = (newFurniture: Furniture) => {
    this.setState({
      canvas: undefined,
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
      <Header canvas={this.state.canvas} originalImageData={this.state.originalImageData} />
      <div className="card-builder">
        <Form furniture={this.state.furniture} updateFurniture={this.updateFurniture} updateOriginalImageData={this.updateOriginalImageData}/>
        <Canvas furniture={this.state.furniture} update={this.updateCanvasBlob}/>
      </div>
    </div>;
  }
}

export default App;
