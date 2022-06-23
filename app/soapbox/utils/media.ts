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

const getVideoDuration = (file: File): Promise<number> => {
  const video = document.createElement('video');

  const promise = new Promise<number>((resolve, reject) => {
    video.addEventListener('loadedmetadata', () => {
      // Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
      if (video.duration === Infinity) {
        video.currentTime = Number.MAX_SAFE_INTEGER;
        video.ontimeupdate = () => {
          video.ontimeupdate = null;
          resolve(video.duration);
          video.currentTime = 0;
        };
      } else {
        resolve(video.duration);
      }
    });

    video.onerror = (event: any) => reject(event.target.error);
  });

  video.src = window.URL.createObjectURL(file);

  return promise;
};

export { getVideoDuration, formatBytes, truncateFilename };
