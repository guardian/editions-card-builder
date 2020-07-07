/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Furniture } from '../types/furniture'
import * as React from 'react'
import CanvasCard from '../utils/canvas'
import debounce  from 'debounce'

interface CanvasProps {
  update: (blob? : Blob) => void
  furniture?: Furniture
}

interface CanvasState {
  card: CanvasCard
  drawDebounce: any
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps){
    super(props)
    this.state = {
      card: new CanvasCard(),
      drawDebounce: undefined
    }
  }

  componentDidMount(){
    this.setState({drawDebounce : debounce(this.draw, 200)});
  }

  shouldComponentUpdate(nextProps: CanvasProps){
    return this.props.furniture != nextProps.furniture;
  }

  componentDidUpdate() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    this.state.drawDebounce.clear();
    this.state.drawDebounce(canvas, this.state, this.props)

  }

  draw(canvas: HTMLCanvasElement, state: CanvasState, props: CanvasProps) {
    if( props.furniture)
    state.card.draw(canvas, props.furniture)
      .then(() => canvas.toBlob( (blob) => props.update(blob || undefined)));
  }

  render() {
    return (
      <canvas ref="canvas" className="card"></canvas>
    )
  }
}

export default Canvas;
