/** @jsx jsx */
import { jsx } from '@emotion/core'

export default function(){
  return (
    <header>
      <div>
        <h1>Editions Card Builder</h1>
        create cards for the Editions app
      </div>
      <div>
        <a id="gridLink" target="_blank" rel="noopener noreferrer">🖼 Grid</a>
        <button id="upload" disabled>Upload</button>
        <a id="download" download>Download</a>
      </div>
    </header>
  )
}
