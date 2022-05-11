const truncateFilename = (url: string, maxLength: number) => {
  const filename = url.split('/').pop();

  if (!filename) {
    return filename;
  }

  if (filename.length <= maxLength) return filename;

  return [
    filename.substr(0, maxLength / 2),
    filename.substr(filename.length - maxLength / 2),
  ].join('…');
};

const formatBytes = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export { formatBytes, truncateFilename };
