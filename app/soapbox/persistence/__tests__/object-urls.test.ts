import {
  createTrackedObjectURL,
  revokeAllTrackedObjectURLs,
  revokeTrackedObjectURL,
  trackedObjectURLCount,
} from '../object-urls';

describe('object URL registry', () => {
  const createObjectURL = jest.fn();
  const revokeObjectURL = jest.fn();

  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
  });

  beforeEach(() => {
    createObjectURL.mockReset();
    createObjectURL
      .mockReturnValueOnce('blob:first')
      .mockReturnValueOnce('blob:second');
  });

  afterEach(() => {
    revokeAllTrackedObjectURLs();
    jest.clearAllMocks();
  });

  it('tracks creation and makes explicit revocation idempotent', () => {
    const url = createTrackedObjectURL(new Blob(['private']));

    expect(trackedObjectURLCount()).toBe(1);
    revokeTrackedObjectURL(url);
    revokeTrackedObjectURL(url);

    expect(trackedObjectURLCount()).toBe(0);
    expect(revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('revokes every remaining temporary resource during purge', () => {
    createTrackedObjectURL(new Blob(['one']));
    createTrackedObjectURL(new Blob(['two']));

    revokeAllTrackedObjectURLs();

    expect(revokeObjectURL.mock.calls).toEqual([['blob:first'], ['blob:second']]);
    expect(trackedObjectURLCount()).toBe(0);
  });
});
