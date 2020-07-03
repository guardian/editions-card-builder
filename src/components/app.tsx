/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from "./header"
import Form from "./form"
import Canvas from "./canvas"
import * as React from 'react'
import { Furniture } from '../types/furniture'

interface AppState {
  canvasBlob?: Blob
  furniture?: Furniture
}


class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      canvasBlob: undefined,
      furniture: {
        headline: "",
        headlineSize: "small",
        standfirst: "",
        standfirstSize: "small",
        position: 0,
        device: "mobile",
        imageUrl: "",
        colourCode: ""
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

  render() {
    return <div>
      <Header canvasBlob={this.state.canvasBlob} />
      <div className="card-builder">
        <Form furniture={this.state.furniture} updateFurniture={this.updateFurniture}/>
        <Canvas furniture={this.state.furniture} update={this.updateCanvasBlob}/>
      </div>
    </div>;
  }
}

export default App;
