/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react';


interface collapsibleProps{
  name: string
}

interface collapsibleState{
  show: boolean
}


export default class Modal extends React.Component<collapsibleProps, collapsibleState> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false
    }
  }



  render(){
    return(
    <div>
      <button type="button" className={`collapsible ${this.state.show? "active" : ""}`} onClick={() => this.setState({show: !this.state.show})}>{this.props.name}</button>
      <div css={{display: this.state.show ? "inherit" : "none"}}>
        {this.props.children}
      </div>
    </div>
    );
  }
}
