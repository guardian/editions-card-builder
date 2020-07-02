/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from "./header"
import Form from "./form"
import Image from "./image"

export default function(){
  return (
    <div>
      <Header/>
      <div className="card-builder">
        <Form/>
        <Image/>
      </div>
    </div>
  )
}
