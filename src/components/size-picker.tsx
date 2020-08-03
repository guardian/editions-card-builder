/** @jsx jsx */
import { jsx } from '@emotion/core'
import { HeadlineSize, StandfirstSize, SizeTypes} from '../enums/size';

export default(props: {
  id: string,
  sizes: SizeTypes,
  chosenSize: HeadlineSize | StandfirstSize | undefined,
  update: (size: string) => void,
 }) => {
  return (
    <div id={props.id}>
      {Object.entries(props.sizes).map(([key, value]) => (
        <span
          key={`headline${key}`}
        >
          <input
            type="radio"
            id={`${props.id}_${key}`}
            name={`${props.id}_${key}`}
            value={value}
            checked={props.chosenSize === value}
            onChange={event => props.update(event.target.value)}
          />
          <label htmlFor={`${props.id}_${key}`}>{key}</label>
        </span>
      ))}
    </div>
  );
}
