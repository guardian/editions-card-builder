/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import config from "../utils/config";
import Modal from "./modal";
import { IframePostMessageService } from "@guardian/grid-client";
import { Reporter } from "@guardian/grid-client/lib/utils"
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

    const postMessageService = new IframePostMessageService(event, Reporter.default)

    if(!postMessageService.isValid) {
      return;
    }

    const imageUrl: URL = postMessageService.highestQualityImageURL!;

    this.setState({
      imageId: postMessageService.imageId!
    });

    this.closeModal();
    this.props.updateImageUrl(imageUrl.toString());
    this.props.updateOriginalImageData(event.data.image);
  };

  getGridQueryString() {
    const { cropRatio, label } = config.crop[this.props.device || "mobile"];
    return `?cropType=${label}&customRatio=${label},10,${cropRatio * 10}`;
  }

  getIframeUrl() {
    const queryString = this.getGridQueryString();
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
