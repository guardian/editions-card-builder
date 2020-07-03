/** @jsx jsx */
import { jsx } from '@emotion/core'
import { upload as GridUpload } from "../grid/upload";
import GridModal from "../grid/modal";
import download from "downloadjs";

interface HeaderProps {
  canvasBlob?: Blob
}

export default function(props: HeaderProps){
  const {canvasBlob} = props;

  // const gridLink = document.getElementById("gridLink") as HTMLLinkElement;
  // const GRID_DOMAIN = process.env.GRID_DOMAIN;

  // const gridModal = new GridModal({
  //   gridDomain: GRID_DOMAIN,
  //   triggerEl: document.querySelector(".image-select"),
  //   targetInput: document.getElementById("imageUrl")
  // });

  const uploadImage = () => {
     //   uploadButton.disabled = true;
  //   uploadButton.innerText = "Uploading";
  //   const canvas = document.querySelector("canvas");

    // canvasBlob =>
    //   new Promise<ArrayBuffer>(resolve => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    //     reader.readAsArrayBuffer(canvasBlob);
    //   })
    //     .then(arrayBuffer  =>
    //       GridUpload({
    //         gridDomain: GRID_DOMAIN,
    //         image: new Uint8Array(arrayBuffer),
    //         originalImage: gridModal.getApiResponse()
    //       })
    //     )
    //     .then(apiResponse => {
    //       const imageUrl = apiResponse.links.find(({ rel }) => rel === "ui:image")
    //         .href;
    //       gridLink.href = imageUrl;
    //       //uploadButton.innerText = "Uploaded";
    //     })
    //     .catch(error => {
    //       // uploadButton.innerText = "Upload";
    //       // uploadButton.disabled = false;
    //       console.error(error);
    //       throw error;
    //     });
  }

  const downloadImage = () => {
    download(canvasBlob, "image.png", "image/png");
  }


  return (
    <header>
      <div>
        <h1>Editions Card Builder</h1>
        create cards for the Editions app
      </div>
      <div>
        <a id="gridLink" target="_blank" rel="noopener noreferrer">🖼 Grid</a>
        <button id="upload" disabled onClick={uploadImage}>Upload</button>

        {!!canvasBlob ? <a id="download" onClick={downloadImage}>Download</a> : null}
      </div>
    </header>
  )
}
