/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react';
import config from "../utils/config"
import Modal from './modal';

interface GridModalProps {
  update: (imageUrl: string) => void
}

interface GridModalState {
  modalOpen: boolean
  imageId: string
}

class ImageSelect extends React.Component<GridModalProps, GridModalState> {
  constructor(props: GridModalProps, state: GridModalState) {
    super(props);
    this.state = {
      modalOpen: false,
      imageId: ""
      }
    }

  toggleModal = () => {
    if (this.state.modalOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  };

  validMessage(data) {
    return data && data.crop && data.crop.data && data.image && data.image.data;
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
  };

  openModal = () => {
    this.setState({ modalOpen: true });
    window.addEventListener('message', this.onMessage, false);
  };

  onMessage = event => {
    if (event.origin !== this.getGridUrl()) {
      return;
    }

    const data = event.data;

    if (!data) {
      return;
    }

    if (!this.validMessage(data)) {
      return;
    }

    const imageUrl = event.data.crop.data.master.secureUrl;
    this.setState({
      imageId: event.data.image.data.id as string
    });

    this.closeModal();
    this.props.update(imageUrl);
  };


  getGridUrl() {
    var gridUrl = `https://${config.gridDomain}`;
    return this.state.imageId
      ? `${gridUrl}/images/${this.state.imageId}`
      : gridUrl;
  }

  render() {
    return(
      <div>
        <button type="button" className="image-select" onClick={this.openModal}>Select image</button>

        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe css={{border: 'none'}} src={this.getGridUrl()} />
        </Modal>

      </div>
    );
  }
}

export default ImageSelect;
