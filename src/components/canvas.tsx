/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Furniture } from '../types/furniture'
import * as React from 'react'
import CanvasCard from '../utils/canvas'

interface CanvasProps {
  update: (blob : Blob) => void
  furniture?: Furniture
}

interface CanvasState {
  card: CanvasCard
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props){
    super(props)
    this.state = {
      card: new CanvasCard()
    }
  }

  shouldComponentUpdate(nextProps){
    return this.props.furniture != nextProps.furniture;
  }

  componentDidUpdate() {
    const canvas = this.refs.canvas as HTMLCanvasElement;

    this.state.card.draw(canvas, this.props.furniture)
      .then(() => canvas.toBlob( (blob) => this.props.update(blob)));

  }

  render() {
    return (
      <canvas ref="canvas" width="500px" height="500px" className="card"></canvas>
    )
  }
}

export default Canvas;
