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
  blobDebounce: any
  showCanvas: boolean
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps){
    super(props)
    this.state = {
      card: new CanvasCard(),
      drawDebounce: debounce(this.draw, 50),
      blobDebounce: debounce(this.updateBlob, 1000),
      showCanvas: false
    }
  }

  shouldComponentUpdate(nextProps: CanvasProps, nextState: CanvasState){
    return (this.props.furniture != nextProps.furniture || this.state.showCanvas != nextState.showCanvas) &&
      !!nextProps.furniture?.imageUrl;
  }

  componentDidUpdate() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    this.state.drawDebounce.clear();
    this.state.drawDebounce(canvas, this.state, this.props);
    this.setState({showCanvas: true});
  }

  draw(canvas: HTMLCanvasElement, state: CanvasState, props: CanvasProps) {
    if( props.furniture) {
      state.blobDebounce.clear();
      state.card.draw(canvas, props.furniture)
        .then(() => {
          state.blobDebounce.clear();
          state.blobDebounce(canvas, props);
        })
        .catch( error =>  console.log(error) );
    }
  }

  updateBlob(canvas: HTMLCanvasElement, props: CanvasProps){
    canvas.toBlob(blob => props.update(blob || undefined))
  }

  render() {
    return (
      <div className="card-builder-right">
        <canvas ref="canvas" className="card" css={{ display: this.state.showCanvas ? "block" : "none" }}></canvas>
      </div>
    )
  }
}

export default Canvas;
