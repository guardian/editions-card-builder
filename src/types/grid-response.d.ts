export interface GridUploadResponse {
  uri: string
}
export interface GridUploadStatusResponse {
  uri: string,
  data: {
    status: string
  }
}
export interface GridImageResponse {
  links: Link[];
}
interface Link {
  rel: string;
  href: string;
}
