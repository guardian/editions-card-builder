/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import config from "../utils/config";
import Modal from "./modal";
import { Device } from "../enums/device";

interface GridModalProps {
  updateImageUrl: (imageUrl: string) => void;
  updateOriginalImageData: (imageData: object) => void;
  device?: Device;
}

interface GridModalState {
  modalOpen: boolean;
  imageId: string;
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

  validMessage(data: any) {
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

  onMessage = (event: MessageEvent) => {
    if (event.origin !== this.getGridUrl()) {
      return;
    }

    const data = event.data;

    if(!data) {
      return;
    }

    if(!this.validMessage(data)) {
      return;
    }

    const imageUrl = event.data.crop.data.master.secureUrl;

    this.setState({
      imageId: event.data.image.data.id as string
    });

    this.closeModal();
    this.props.updateImageUrl(imageUrl);
    this.props.updateOriginalImageData(event.data.image);
  };

  getGridQueryString() {
    const { cropWidth, cropHeight, label } = config.crop[
      this.props.device || "mobile"
    ];
    return `?cropType=${label}&customRatio=${label},${cropWidth},${cropHeight}`;
  }

  getIframeUrl() {
    // TODO: query string removed in rushed friday afternoon fix
    // suspected to be related to https://github.com/guardian/editions-card-builder/pull/86
    const queryString = '';
    return this.state.imageId
      ? `${this.getGridUrl()}/images/${this.state.imageId}${queryString}`
      : `${this.getGridUrl()}${queryString}`;
  }

  getGridUrl() {
    return `https://${config.gridDomain}`;
  }

  render() {
    return (
      <div>
        <button type="button" className="image-select" onClick={this.openModal}>
          Select image
        </button>

        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe css={{ border: "none" }} src={this.getIframeUrl()} />
        </Modal>
      </div>
    );
  }
}

export default ImageSelect;
