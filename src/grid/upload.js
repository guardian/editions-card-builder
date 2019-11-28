import Config from "../config";

const TIMEOUT = 1500;

function wait(fn) {
  return new Promise(resolve => setTimeout(_ => resolve(fn()), TIMEOUT));
}

function uploadImage({ gridDomain, image }) {
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
      wait(
        // wait for media-api to index the new image
        () => fetch(res.uri, { credentials: "include" }).then(res => res.json())
      )
    );
}

function editImage({ endpoint, method, body }) {
  return fetch(endpoint, {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: body })
  }).then(res => res.json());
}

function addLabels({ apiResponse }) {
  return editImage({
    endpoint: apiResponse.data.userMetadata.data.labels.uri,
    method: "POST",
    body: Config.upload.labels
  });
}

function copyMetadata({ apiResponse, originalImage }) {
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

function copyUsageRights({ apiResponse, originalImage }) {
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

function addCollections({ apiResponse }) {
  const endpoint = apiResponse.actions.find(
    action => action.name === "add-collection"
  ).href;

  return editImage({
    endpoint,
    method: "POST",
    body: Config.upload.collections
  });
}

export async function upload({ gridDomain, image, originalImage }) {
  const apiResponse = await uploadImage({ gridDomain, image });
  await Promise.all([
    addLabels({ apiResponse }),
    copyMetadata({ apiResponse, originalImage }),
    copyUsageRights({ apiResponse, originalImage }),
    addCollections({ apiResponse })
  ]);
  return apiResponse;
}
