/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Furniture } from '../types/furniture'
import * as React from 'react'
import CanvasCard from '../utils/canvas'
import debounce  from 'debounce'

interface CanvasProps {
  update: (canvas? : HTMLCanvasElement) => void
  furniture?: Furniture
}

interface CanvasState {
  card: CanvasCard
  showCanvas: boolean
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  constructor(props: CanvasProps){
    super(props)
    this.state = {
      card: new CanvasCard(),
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
      const canvasOverlay = this.refs.canvasoverlay as HTMLCanvasElement;

      this.state.card.draw(canvas, canvasOverlay, this.props.furniture)
        .then(() => {
          this.props.update(canvas);
        })
        .catch( error =>  console.log(error) );
    }
  }

  render() {
    return (
      <div className="card-builder-right">
        <canvas ref="canvas" className="card canvas-layers" css={{ display: this.state.showCanvas ? "block" : "none" }}></canvas>
        <canvas ref="canvasoverlay" className="canvas-layers" css={{ display: this.state.showCanvas ? "block" : "none" }}></canvas>
      </div>
    )
  }
}

export default Canvas;
