export const truncateFilename = (url, maxLength) => {
  const filename = url.split('/').pop();

  if (filename.length <= maxLength) return filename;

  return [
    filename.substr(0, maxLength/2),
    filename.substr(filename.length - maxLength/2),
  ].join('…');
};
