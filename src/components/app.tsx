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
      furniture: undefined
    }
  }

  updateCanvasBlob = (newBlob) => {
    console.log("updating with a new blob")
    this.setState({
      canvasBlob: newBlob
    })
  }

  render() {
    return <div>
      <Header canvasBlob={this.state.canvasBlob} />
      <div className="card-builder">
        {/* <Form/> */}
        <Canvas furniture={this.state.furniture} update={this.updateCanvasBlob} message="Hello"/>
      </div>
    </div>;
  }
}

export default App;
