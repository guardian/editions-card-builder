/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Furniture } from '../types/furniture'
import * as React from 'react'
import CanvasCard from '../utils/canvas'
import debounce from "debounce";

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

    const card = new CanvasCard();

    debounce(card.draw(canvas, this.props.furniture).then(() => canvas.toBlob( (blob) => this.props.update(blob))), 50);

  }

  render() {
    return (
      <canvas ref="canvas" width="500px" height="500px" className="card"></canvas>
    )
  }
}

export default Canvas;
