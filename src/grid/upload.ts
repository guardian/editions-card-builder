import Config from "../utils/config";
import { ArgoGridImage, GridImage } from "@guardian/grid-client";

const TIMEOUT = 1500;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uploadImage({ gridDomain, image }: { gridDomain: string, image: any }): Promise<ArgoGridImage> {
  return fetch(`https://loader.${gridDomain}/images`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/octet-stream"
    },
    body: image
  })
  .then(res => res.json())
  .then(uploadedImage => {
    return uploadedImage as ArgoGridImage
  })
  .then(res =>
    sleep(TIMEOUT).then(_ =>
      fetch(res.uri.toString(), { credentials: "include" })
        .then(res => res.json())
        .then(json => json as ArgoGridImage)
  ))
}

function editImage({ endpoint, method, body }: { endpoint: URL, method: string, body: any }) {
  return fetch(endpoint.toString(), {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: body })
  }).then(res => res.json());
}

function addLabels(argoImage: ArgoGridImage) {
  return editImage({
    endpoint: argoImage.data.userMetadata?.data.labels.uri!,
    method: "POST",
    body: Config.upload.labels
  });
}

function copyMetadata(newImage: ArgoGridImage, originalImage: GridImage) {
  const originalMetadata = originalImage.metadata;
  const copiedMetadata = Object.entries(originalMetadata).reduce(
    (acc, [key, value]) => {
      return Config.upload.metadataToCopy.includes(key)
        ? { ...acc, [key]: value }
        : acc;
    },
    {}
  );

  return editImage({
    endpoint: newImage.data.userMetadata!.data.metadata.uri,
    method: "PUT",
    body: copiedMetadata
  });
}

function copyUsageRights(newImage: ArgoGridImage, originalImage: GridImage) {
  const originalUsageRights = originalImage.usageRights;

  if (!originalUsageRights) {
    return Promise.resolve();
  }

  return editImage({
    endpoint: newImage.data.userMetadata!.data.usageRights!.uri,
    method: "PUT",
    body: originalUsageRights
  });
}

function addCollections(newImage: ArgoGridImage) {
  const endpoint = newImage.actions?.find(_ => _.name === "add-collection")?.href!;

  return editImage({
    endpoint,
    method: "POST",
    body: Config.upload.collections
  });
}

export async function upload({ gridDomain, image, originalImage }: { gridDomain: string, image: any, originalImage: GridImage }): Promise<ArgoGridImage> {
  const newImage: ArgoGridImage = await uploadImage({ gridDomain, image });
  await Promise.all([
    addLabels(newImage),
    copyMetadata(newImage, originalImage),
    copyUsageRights(newImage, originalImage),
    addCollections(newImage)
  ]);
  return newImage;
}
