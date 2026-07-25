const activeObjectUrls = new Set<string>();

const createTrackedObjectURL = (object: Blob | MediaSource): string => {
  const url = URL.createObjectURL(object);
  activeObjectUrls.add(url);
  return url;
};

const revokeTrackedObjectURL = (url: string): void => {
  if (!url.startsWith('blob:')) return;
  URL.revokeObjectURL(url);
  activeObjectUrls.delete(url);
};

const revokeAllTrackedObjectURLs = (): void => {
  for (const url of activeObjectUrls) URL.revokeObjectURL(url);
  activeObjectUrls.clear();
};

const trackedObjectURLCount = (): number => activeObjectUrls.size;

export {
  createTrackedObjectURL,
  revokeAllTrackedObjectURLs,
  revokeTrackedObjectURL,
  trackedObjectURLCount,
};
