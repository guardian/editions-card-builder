import templateString from './template.html';
import './modal.css';

class GridModal {
  constructor({gridUrl, triggerEl, targetInput}) {
    this.gridUrl = gridUrl;
    this.triggerEl = triggerEl;
    this.targetInput = targetInput;

    const templates = document.createRange().createContextualFragment(templateString);
    this.modalTemplate = templates.getElementById('grid-modal-template');

    this.messageHandler = event => {
      this._handleMessage(event);
      window.removeEventListener('message', this.messageHandler, false);
    }

    this.triggerEl.addEventListener('click', () => this.open());
  }

  getGridUrl() {
    return this.imageId
      ? `${this.gridUrl}/images/${this.imageId}`
      : this.gridUrl;
  }

  open() {
    const modalNode = document.importNode(this.modalTemplate.content, true);
    modalNode.querySelector('iframe').src = this.getGridUrl();
    modalNode.querySelector('.modal__dismiss').addEventListener('click', () => this.close());

    window.addEventListener('message', this.messageHandler, false);

    document.body.appendChild(modalNode);
  }

  close() {
    document.body.removeChild(document.querySelector('.modal'));
  }

  _isValidMessage(data) {
    return (
      data
      && data.crop
      && data.crop.data
      && data.image
      && data.image.data
    );
  }

  _handleMessage(event) {
    if (event.origin !== this.gridUrl || !this._isValidMessage(event.data)) {
      return;
    }
    this.imageId = event.data.image.data.id;
    this.targetInput.value = event.data.crop.data.master.secureUrl;
    this.targetInput.parentElement.dispatchEvent(new Event('input'));
    this.close();
  }
}

export default GridModal;
