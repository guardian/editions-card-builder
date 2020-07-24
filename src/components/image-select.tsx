/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react';
import config from "../utils/config"
import Modal from './modal';
import {Validators as GridValidators, CropSelection, GridImage} from '@guardian/grid-client'

interface GridModalProps {
  updateImageUrl: (imageUrl: string) => void
  updateOriginalImageData: (imageData: GridImage) => void
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

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
  };

  openModal = () => {
    this.setState({ modalOpen: true });
    window.addEventListener('message', this.onMessage, false);
  };

  onMessage = (event: MessageEvent) => {
    if (event.origin !== this.getGridUrl()) {
      return;
    }

    const data = event.data;

    if (!data) {
      return;
    }

    const gridImage: CropSelection | undefined = GridValidators.iframePostMessage(data)

    if(!gridImage) {
      return;
    }

    const imageUrl: URL = gridImage?.crop.data.master?.secureUrl!

    this.setState({
      imageId: gridImage?.image.data.id
    });

    this.closeModal();
    this.props.updateImageUrl(imageUrl.toString());
    this.props.updateOriginalImageData(gridImage.image.data);
  };

  getIframeUrl(){
    return this.state.imageId
      ? `${this.getGridUrl()}/images/${this.state.imageId}`
      : this.getGridUrl();
  }

  getGridUrl() {
    return`https://${config.gridDomain}`;
  }

  render() {
    return(
      <div>
        <button type="button" className="image-select" onClick={this.openModal}>Select image</button>

        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe css={{border: 'none'}} src={this.getIframeUrl()} />
        </Modal>

      </div>
    );
  }
}

export default ImageSelect;
