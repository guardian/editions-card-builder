export enum HeadlineSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  XLarge = 'xLarge'
}

export enum StandfirstSize {
  Small = "small",
  Medium = "medium"
}

export type SizeTypes = typeof HeadlineSize | typeof StandfirstSize;
