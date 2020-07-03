/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from "./header"
import Form from "./form"
import { Furniture } from '../types/furniture'
import * as React from 'react'

interface CanvasProps {
  update: (blob : Blob) => void
  furniture?: Furniture
}

class Canvas extends React.Component<CanvasProps> {
  constructor(props){
    super(props)
  }

  shouldComponentUpdate(nextProps){
    return this.props.furniture != nextProps.furniture;
  }

  componentDidUpdate() {
    const canvas = this.refs.canvas as HTMLCanvasElement;

    const canvasContext = canvas.getContext("2d");
    canvasContext.fillStyle = "red";
    canvasContext.fillText(this.props.furniture.headline, 250, 250);
    console.log("Drew text")

    canvas.toBlob( (blob) => this.props.update(blob));
  }

  render() {
    return (
      <canvas ref="canvas" width="500px" height="500px">

      </canvas>
    )
  }
}

export default Canvas;
