import { resolvePosition, shouldUploadMarker } from '../markers';

describe('Server marker degradation (criterion 9)', () => {
  const statusIds = ['s5', 's4', 's3', 's2', 's1']; // newest first

  describe('resolvePosition', () => {
    it('local anchor always wins over server marker', () => {
      const result = resolvePosition('s3', { lastReadId: 's1', version: 1, updatedAt: '' }, statusIds);
      expect(result.source).toBe('local-anchor');
      expect(result.statusId).toBe('s3');
    });

    it('local anchor wins even when status not in available list', () => {
      const result = resolvePosition('s99', { lastReadId: 's3', version: 1, updatedAt: '' }, statusIds);
      expect(result.source).toBe('local-anchor');
      expect(result.statusId).toBe('s99');
      expect(result.reason).toContain('hydrate');
    });

    it('uses server marker only when no local anchor exists', () => {
      const result = resolvePosition(null, { lastReadId: 's3', version: 1, updatedAt: '' }, statusIds);
      expect(result.source).toBe('server-marker');
      expect(result.statusId).toBe('s3');
    });

    it('ignores server marker pointing to unavailable status', () => {
      const result = resolvePosition(null, { lastReadId: 's-unknown', version: 1, updatedAt: '' }, statusIds);
      expect(result.source).toBe('none');
      expect(result.statusId).toBeNull();
      expect(result.reason).toContain('unavailable');
    });

    it('returns none when no anchor and no marker', () => {
      const result = resolvePosition(null, null, statusIds);
      expect(result.source).toBe('none');
      expect(result.statusId).toBeNull();
    });

    it('returns none when no anchor and marker has empty lastReadId', () => {
      const result = resolvePosition(null, { lastReadId: '', version: 1, updatedAt: '' }, statusIds);
      expect(result.source).toBe('none');
    });

    it('server marker NEVER moves user backward (local precedence)', () => {
      // User has read to s5 (newest), server thinks s2
      const result = resolvePosition('s5', { lastReadId: 's2', version: 2, updatedAt: '' }, statusIds);
      expect(result.source).toBe('local-anchor');
      expect(result.statusId).toBe('s5'); // NOT moved back to s2
    });
  });

  describe('shouldUploadMarker', () => {
    it('returns true when position changed and interval passed', () => {
      const result = shouldUploadMarker('s5', 's3', Date.now() - 300000);
      expect(result).toBe(true);
    });

    it('returns false when position unchanged', () => {
      expect(shouldUploadMarker('s5', 's5', Date.now() - 300000)).toBe(false);
    });

    it('returns false when interval not met', () => {
      expect(shouldUploadMarker('s5', 's3', Date.now() - 10000)).toBe(false);
    });

    it('returns false for null position', () => {
      expect(shouldUploadMarker(null, null, null)).toBe(false);
    });

    it('returns true on first upload (no previous state)', () => {
      expect(shouldUploadMarker('s5', null, null)).toBe(true);
    });
  });
});
