import "./modal.css";
import { GridResponse } from "../types/grid-response";

class GridModal {

  gridUrl: string;
  triggerEl: HTMLElement;
  targetInput: HTMLInputElement;
  modalTemplate: HTMLTemplateElement;
  messageHandler: EventHandlerNonNull;
  imageId: string;
  apiResponse: GridResponse;

  constructor({ gridDomain, triggerEl, targetInput }) {
    this.gridUrl = `https://${gridDomain}`;
    this.triggerEl = triggerEl;
    this.targetInput = targetInput;

    const templates = document
      .createRange()
      .createContextualFragment(`<template id="grid-modal-template">
      <div class="modal">
        <div class="modal__content">
          <div class="modal__header">
            <button type="button" class="button modal__dismiss">Close</button>
          </div>
          <div class="modal__body">
            <iframe frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </template>`);
    this.modalTemplate = <HTMLTemplateElement>templates.getElementById("grid-modal-template");

    this.messageHandler = event => {
      this._handleMessage(event);
      window.removeEventListener("message", this.messageHandler, false);
    };

    this.triggerEl.addEventListener("click", () => this.open());
  }

  getGridUrl() {
    return this.imageId
      ? `${this.gridUrl}/images/${this.imageId}`
      : this.gridUrl;
  }

  open() {
    const modalNode = document.importNode(this.modalTemplate.content, true);
    modalNode.querySelector("iframe").src = this.getGridUrl();
    modalNode
      .querySelector(".modal__dismiss")
      .addEventListener("click", () => this.close());

    window.addEventListener("message", this.messageHandler, false);

    document.body.appendChild(modalNode);
  }

  close() {
    document.body.removeChild(document.querySelector(".modal"));
  }

  getApiResponse() {
    return this.apiResponse;
  }

  _isValidMessage(data) {
    return data && data.crop && data.crop.data && data.image && data.image.data;
  }

  _handleMessage(event) {
    if (event.origin !== this.gridUrl || !this._isValidMessage(event.data)) {
      return;
    }
    this.apiResponse = event.data.image;
    this.imageId = event.data.image.data.id;
    this.targetInput.value = event.data.crop.data.master.secureUrl;
    this.targetInput.parentElement.dispatchEvent(new Event("input"));
    this.close();
  }
}

export default GridModal;
