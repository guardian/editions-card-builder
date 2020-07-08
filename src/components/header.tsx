/** @jsx jsx */
import { jsx } from '@emotion/core'
import { upload as GridUpload, upload } from "../grid/upload";
import download from "downloadjs";
import config from '../utils/config';
import { useState } from 'react';

interface HeaderProps {
  canvasBlob?: Blob
  originalImageData?: object
}

export default function(props: HeaderProps){
  const {canvasBlob} = props;

  const [gridLink, setGridLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadImage = () => {

    if(uploading){
      return;
    }

    var upload = (canvasBlob: Blob) =>
      new Promise<ArrayBuffer>(resolve => {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.readAsArrayBuffer(canvasBlob);
      })
      .then(arrayBuffer  =>
        GridUpload({
          gridDomain: config.gridDomain,
          image: new Uint8Array(arrayBuffer),
          originalImage: props.originalImageData
        })
      )
      .then(apiResponse => {
        setUploading(false);
        const imageUrl = apiResponse.links.find(({ rel }) => rel === "ui:image")?.href;
        if(imageUrl){
          setGridLink(imageUrl);
        }
      })
      .catch(error => {
        setUploading(false);
        console.error(error);
        throw error;
      });

      if(canvasBlob){
        upload(canvasBlob);
      }
  }

  const downloadImage = () => {
    if(canvasBlob){
      download(canvasBlob, "image.png", "image/png");
    }
  }


  return (
    <header>
      <div>
        <h1>Editions Card Builder</h1>
        create cards for the Editions app
      </div>
      <div>
        {!!gridLink ? <a href={gridLink} id="gridLink" target="_blank" rel="noopener noreferrer">🖼 Grid</a> : null}
        {!!canvasBlob ? <button id="upload" onClick={uploadImage}>{uploading ? "Uploading" : "Upload"}</button>: null}
        {!!canvasBlob ? <button id="download" onClick={downloadImage}>Download</button> : null}
      </div>
    </header>
  )
}
