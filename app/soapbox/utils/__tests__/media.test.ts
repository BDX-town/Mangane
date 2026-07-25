import { getVideoDuration } from '../media';

describe('getVideoDuration()', () => {
  const createObjectURL = jest.fn(() => 'blob:video');
  const revokeObjectURL = jest.fn();
  let loadedmetadata: () => void;
  let video: any;

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    video = {
      addEventListener: jest.fn((event, callback) => {
        if (event === 'loadedmetadata') loadedmetadata = callback;
      }),
      removeAttribute: jest.fn(),
      duration: 12,
      currentTime: 0,
      onerror: null,
      ontimeupdate: null,
      src: '',
    };
    jest.spyOn(document, 'createElement').mockReturnValue(video);
    Object.defineProperties(window.URL, {
      createObjectURL: { configurable: true, value: createObjectURL },
      revokeObjectURL: { configurable: true, value: revokeObjectURL },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('revokes the temporary URL after reading metadata', async() => {
    const result = getVideoDuration(new File(['video'], 'video.mp4'));
    loadedmetadata();

    await expect(result).resolves.toBe(12);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:video');
    expect(video.removeAttribute).toHaveBeenCalledWith('src');
  });

  it('revokes the temporary URL when metadata loading fails', async() => {
    const result = getVideoDuration(new File(['invalid'], 'invalid.mp4'));
    video.onerror({ target: { error: new Error('invalid video') } });

    await expect(result).rejects.toThrow('invalid video');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:video');
  });
});
