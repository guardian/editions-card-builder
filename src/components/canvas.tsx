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
  blobDebounce: any
  showCanvas: boolean
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps){
    super(props)
    this.state = {
      card: new CanvasCard(),
      blobDebounce: debounce(this.updateBlob, 1000),
      showCanvas: false
    }
  }

  shouldComponentUpdate(nextProps: CanvasProps, nextState: CanvasState){
    return (this.props.furniture != nextProps.furniture || this.state.showCanvas != nextState.showCanvas) &&
      !!nextProps.furniture?.imageUrl;
  }

  componentDidUpdate() {
    this.draw();
    this.setState({showCanvas: true});
  }

  draw() {
    if( this.props.furniture) {
      const canvas = this.refs.canvas as HTMLCanvasElement;
      this.state.blobDebounce.clear();
      this.state.card.draw(canvas, this.props.furniture)
        .then(() => {
          this.state.blobDebounce.clear();
          this.state.blobDebounce(canvas, this.props.update);
        })
        .catch( error =>  console.log(error) );
    }
  }

  updateBlob(canvas: HTMLCanvasElement, update: (blob? : Blob) => void){
    canvas.toBlob(blob => update(blob || undefined))
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
