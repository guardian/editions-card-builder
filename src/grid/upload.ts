import Config from "../utils/config";
import { GridResponse } from "../types/grid-response";

const TIMEOUT = 1500;

function wait<T>(fn: () => any): Promise<T> {
  return new Promise(resolve => setTimeout(_ => resolve(fn()), TIMEOUT));
}

function uploadImage({ gridDomain, image }: { gridDomain: string, image: any }): Promise<GridResponse> {
  return fetch(`https://loader.${gridDomain}/images`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/octet-stream"
    },
    body: image
  })
    .then(res => res.json())
    .then(res =>
      wait<GridResponse>(
        // wait for media-api to index the new image
        () => fetch(res.uri, { credentials: "include" }).then(res => res.json())
      )
    );
}

function editImage({ endpoint, method, body }: { endpoint: string, method: string, body: any }) {
  return fetch(endpoint, {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: body })
  }).then(res => res.json());
}

function addLabels({ apiResponse }: { apiResponse: any }) {
  return editImage({
    endpoint: apiResponse.data.userMetadata.data.labels.uri,
    method: "POST",
    body: Config.upload.labels
  });
}

function copyMetadata({ apiResponse, originalImage }: { apiResponse: any, originalImage: any }) {
  const originalMetadata = originalImage.data.metadata;
  const copiedMetadata = Object.entries(originalMetadata).reduce(
    (acc, [key, value]) => {
      return Config.upload.metadataToCopy.includes(key)
        ? { ...acc, [key]: value }
        : acc;
    },
    {}
  );

  return editImage({
    endpoint: apiResponse.data.userMetadata.data.metadata.uri,
    method: "PUT",
    body: copiedMetadata
  });
}

function copyUsageRights({ apiResponse, originalImage }: { apiResponse: any, originalImage: any }) {
  const originalUsageRights = originalImage.data.usageRights;

  if (!originalUsageRights) {
    return Promise.resolve();
  }

  return editImage({
    endpoint: apiResponse.data.userMetadata.data.usageRights.uri,
    method: "PUT",
    body: originalUsageRights
  });
}

function addCollections({ apiResponse }: { apiResponse: any}) {
  const endpoint = apiResponse.actions.find(
    (action: any) => action.name === "add-collection"
  ).href;

  return editImage({
    endpoint,
    method: "POST",
    body: Config.upload.collections
  });
}

export async function upload({ gridDomain, image, originalImage }: { gridDomain: string, image: any, originalImage: any }): Promise<GridResponse> {
  const apiResponse = await uploadImage({ gridDomain, image });
  await Promise.all([
    addLabels({ apiResponse }),
    copyMetadata({ apiResponse, originalImage }),
    copyUsageRights({ apiResponse, originalImage }),
    addCollections({ apiResponse })
  ]);
  return apiResponse;
}
