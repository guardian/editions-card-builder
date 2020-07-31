/** @jsx jsx */
import { jsx } from '@emotion/core'
import { upload as GridUpload, upload } from "../grid/upload";
import download from "downloadjs";
import config from '../utils/config';
import { useState } from 'react';

interface HeaderProps {
  canvas?: HTMLCanvasElement
  originalImageData?: object
}

export default function(props: HeaderProps){
  const {canvas} = props;

  const [gridLink, setGridLink] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const uploadImage = () => {

    if(uploading || !canvas){
      return;
    }

    canvas.toBlob( (blob) => {
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

        if(blob){
          setGridLink(undefined);
          upload(blob);
        }

    })
  }

  const downloadImage = () => {

    if(downloading || !canvas){
      return;
    }

    setDownloading(true);
    canvas.toBlob( (blob) => {
      if(blob){
        download(blob, "image.png", "image/png");
      }
      setDownloading(false);
    });
  }


  return (
    <header>
      <div>
        <h1>Editions Card Builder</h1>
        create cards for the Editions app
      </div>
      <div>
        {!!gridLink ? <a href={gridLink} id="gridLink" target="_blank" rel="noopener noreferrer">🖼 Grid</a> : null}
        <button id="upload" onClick={uploadImage} disabled={!canvas}>{uploading ? "Uploading" : "Upload"}</button>
        <button id="download" onClick={downloadImage} disabled={!canvas}>Download</button>
      </div>
    </header>
  )
}
