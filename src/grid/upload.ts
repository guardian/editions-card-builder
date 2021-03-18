import Config from "../utils/config";
import { GridUploadResponse, GridImageResponse, GridUploadStatusResponse } from "../types/grid-response";

const TIMEOUT = 1500;

function wait<T>(fn: () => any): Promise<T> {
  return new Promise(resolve => setTimeout(_ => resolve(fn()), TIMEOUT));
}

function uploadImage({ gridDomain, image }: { gridDomain: string, image: any }): Promise<GridUploadResponse> {
  return fetch(`https://loader.${gridDomain}/images`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/octet-stream"
    },
    body: image
  })
  .then(res => res.json())
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

function addLabels({ imageResponse }: { imageResponse: any }) {
  return editImage({
    endpoint: imageResponse.data.userMetadata.data.labels.uri,
    method: "POST",
    body: Config.upload.labels
  });
}

function copyMetadata({ imageResponse, originalImage }: { imageResponse: any, originalImage: any }) {
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
    endpoint: imageResponse.data.userMetadata.data.metadata.uri,
    method: "PUT",
    body: copiedMetadata
  });
}

function copyUsageRights({ imageResponse, originalImage }: { imageResponse: any, originalImage: any }) {
  const originalUsageRights = originalImage.data.usageRights;

  if (!originalUsageRights) {
    return Promise.resolve();
  }

  return editImage({
    endpoint: imageResponse.data.userMetadata.data.usageRights.uri,
    method: "PUT",
    body: originalUsageRights
  });
}

function addCollections({ imageResponse }: { imageResponse: any}) {
  const endpoint = imageResponse.actions.find(
    (action: any) => action.name === "add-collection"
  ).href;

  return editImage({
    endpoint,
    method: "POST",
    body: Config.upload.collections
  });
}

export async function upload({ gridDomain, image, originalImage }: { gridDomain: string, image: any, originalImage: any }): Promise<GridImageResponse | null> {

  const getStatus = (uri: string) => wait<GridImageResponse | null>(
      // wait for media-api to index the new image
      () => fetch(uri, { credentials: "include" })
      .then(res => res.json())
      .then(async (res: GridUploadStatusResponse): Promise<GridImageResponse | null> => {
        switch(res.data.status){
          case "COMPLETED":
            return await fetch(res.uri, { credentials: "include" }).then(res => res.json());
          case "FAILED":
            throw(new Error("Image upload failed"))
          default:
            return await getStatus("uri");
        }
      })
    )

  try {
    const uploadResponse = await uploadImage({ gridDomain, image });

    const imageResponse = await getStatus(uploadResponse.uri);

    if(!!imageResponse){
      await Promise.all([
        addLabels({ imageResponse }),
        copyMetadata({ imageResponse, originalImage }),
        copyUsageRights({ imageResponse, originalImage }),
        addCollections({ imageResponse })
      ]);
    }
    return imageResponse;
  }
  catch (e) {
    alert(`Issue upload image ${e instanceof Error ? e.message : e}`);
  }

  return  null;

}
