import {
  validateRecord,
  clampTimestamp,
  determineAction,
  createEmptyReport,
  accumulateReport,
} from '../integrity';

import type { IntegrityViolation } from '../integrity';

describe('Integrity Validation', () => {
  const accountUrl = 'https://mastodon.social/users/test';

  describe('validateRecord — base checks', () => {
    it('returns critical violation for null record', () => {
      const violations = validateRecord('statuses', null, accountUrl);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].severity).toBe('critical');
    });

    it('returns critical violation for non-object record', () => {
      const violations = validateRecord('statuses', 'not an object', accountUrl);
      expect(violations[0].severity).toBe('critical');
    });

    it('detects missing accountUrl', () => {
      const violations = validateRecord('statuses', { id: 'x', localUpdatedAt: 1 }, accountUrl);
      expect(violations.some(v => v.violation.includes('accountUrl'))).toBe(true);
    });

    it('detects accountUrl scope mismatch (IDOR attempt)', () => {
      const violations = validateRecord('statuses', {
        id: 'x',
        accountUrl: 'https://evil.com/users/hacker',
        localUpdatedAt: Date.now(),
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('IDOR'))).toBe(true);
      expect(violations.some(v => v.severity === 'critical')).toBe(true);
    });

    it('flags future timestamps as warning', () => {
      const future = Date.now() + 120000; // 2 minutes in the future
      const violations = validateRecord('statuses', {
        id: 'x',
        accountUrl,
        localUpdatedAt: future,
        content: 'test',
        accountId: 'a1',
        visibility: 'public',
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('future'))).toBe(true);
      expect(violations.every(v => v.severity === 'warning')).toBe(true);
    });

    it('passes valid record with no violations', () => {
      const violations = validateRecord('statuses', {
        id: 'status-1',
        accountUrl,
        localUpdatedAt: Date.now() - 1000,
        content: '<p>Hello</p>',
        accountId: 'account-1',
        visibility: 'public',
      }, accountUrl);
      expect(violations).toHaveLength(0);
    });
  });

  describe('validateRecord — statuses', () => {
    it('detects missing status id', () => {
      const violations = validateRecord('statuses', {
        accountUrl,
        localUpdatedAt: Date.now(),
        content: 'test',
        accountId: 'a1',
        visibility: 'public',
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('Missing status id'))).toBe(true);
    });

    it('detects non-string content', () => {
      const violations = validateRecord('statuses', {
        id: 's1',
        accountUrl,
        localUpdatedAt: Date.now(),
        content: 123,
        accountId: 'a1',
        visibility: 'public',
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('content'))).toBe(true);
    });

    it('detects invalid visibility', () => {
      const violations = validateRecord('statuses', {
        id: 's1',
        accountUrl,
        localUpdatedAt: Date.now(),
        content: 'test',
        accountId: 'a1',
        visibility: 'invalid',
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('visibility'))).toBe(true);
    });
  });

  describe('validateRecord — accounts', () => {
    it('detects missing username', () => {
      const violations = validateRecord('accounts', {
        id: 'a1',
        accountUrl,
        localUpdatedAt: Date.now(),
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('username'))).toBe(true);
    });
  });

  describe('validateRecord — notifications', () => {
    it('detects missing notification type', () => {
      const violations = validateRecord('notifications', {
        id: 'n1',
        accountUrl,
        localUpdatedAt: Date.now(),
      }, accountUrl);
      expect(violations.some(v => v.violation.includes('notification type'))).toBe(true);
    });
  });

  describe('clampTimestamp', () => {
    it('leaves past timestamps unchanged', () => {
      const past = Date.now() - 10000;
      expect(clampTimestamp(past)).toBe(past);
    });

    it('clamps future timestamps to now', () => {
      const future = Date.now() + 100000;
      const clamped = clampTimestamp(future);
      expect(clamped).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('determineAction', () => {
    it('returns pass for no violations', () => {
      expect(determineAction([])).toBe('pass');
    });

    it('returns quarantine for critical violations', () => {
      const violations: IntegrityViolation[] = [{
        table: 'statuses', accountUrl: 'x', entityId: '1',
        violation: 'critical issue', severity: 'critical', detectedAt: 0,
      }];
      expect(determineAction(violations)).toBe('quarantine');
    });

    it('returns heal for warning-only violations', () => {
      const violations: IntegrityViolation[] = [{
        table: 'statuses', accountUrl: 'x', entityId: '1',
        violation: 'minor issue', severity: 'warning', detectedAt: 0,
      }];
      expect(determineAction(violations)).toBe('heal');
    });

    it('returns quarantine when both critical and warning exist', () => {
      const violations: IntegrityViolation[] = [
        { table: 'statuses', accountUrl: 'x', entityId: '1', violation: 'bad', severity: 'critical', detectedAt: 0 },
        { table: 'statuses', accountUrl: 'x', entityId: '1', violation: 'minor', severity: 'warning', detectedAt: 0 },
      ];
      expect(determineAction(violations)).toBe('quarantine');
    });
  });

  describe('Report accumulation', () => {
    it('tracks checked, corrupted, and violation counts', () => {
      const report = createEmptyReport();

      // Valid record
      accumulateReport(report, []);
      expect(report.checked).toBe(1);
      expect(report.corrupted).toBe(0);

      // Warning record
      accumulateReport(report, [{
        table: 'statuses', accountUrl: 'x', entityId: '1',
        violation: 'future timestamp', severity: 'warning', detectedAt: 0,
      }]);
      expect(report.checked).toBe(2);
      expect(report.corrupted).toBe(1);
      expect(report.healed).toBe(1);

      // Critical record
      accumulateReport(report, [{
        table: 'statuses', accountUrl: 'x', entityId: '2',
        violation: 'missing id', severity: 'critical', detectedAt: 0,
      }]);
      expect(report.checked).toBe(3);
      expect(report.corrupted).toBe(2);
      expect(report.quarantined).toBe(1);
      expect(report.violationCounts['future timestamp']).toBe(1);
      expect(report.violationCounts['missing id']).toBe(1);
    });

    it('does not leak record content into report', () => {
      const report = createEmptyReport();
      accumulateReport(report, [{
        table: 'statuses', accountUrl: 'https://example.com/users/secret',
        entityId: 'private-status-id', violation: 'test violation',
        severity: 'warning', detectedAt: 0,
      }]);
      const serialized = JSON.stringify(report);
      // The report should contain violation type but not entity content
      expect(serialized).toContain('test violation');
      expect(serialized).not.toContain('secret'); // No accountUrl content
      expect(serialized).not.toContain('private-status-id'); // No entity ID
    });
  });
});
