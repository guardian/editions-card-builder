/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react';

interface ModalProps {
    isOpen: boolean,
    dismiss: () => void
}

export default class Modal extends React.Component<ModalProps> {
  preventClosingClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
  }

  render() {
    if (!this.props.isOpen) {
      return false;
    }

    return (
      <div className="modal" onClick={this.props.dismiss}>
        <div className="modal__content" onClick={this.preventClosingClick}>
          <div className="modal__header">
            <button className="i-cross modal__dismiss" onClick={this.props.dismiss}>
              Close
            </button>
          </div>
          <div className="modal__body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
