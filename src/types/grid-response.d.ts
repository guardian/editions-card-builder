export interface GridResponse {
  links: Link[];
}

interface Link {
  rel: string;
  href: string;
}
