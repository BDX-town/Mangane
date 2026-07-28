import {
  registerMigration,
  runPendingMigrations,
  getMigrationDiagnostics,
  resetMigrationJournal,
} from '../migrations';


describe('Migration System', () => {
  beforeEach(() => {
    resetMigrationJournal();
    localStorage.clear();
  });

  afterEach(() => {
    resetMigrationJournal();
  });

  it('runs a registered migration and marks it completed', async() => {
    const runFn = jest.fn(async(progress) => {
      progress(5, 10);
      progress(10, 10);
    });

    registerMigration({
      id: 'test-migration-1',
      targetVersion: 1,
      description: 'Test migration',
      run: runFn,
    });

    const report = await runPendingMigrations();
    const result = report.migrations.find(m => m.id === 'test-migration-1');
    expect(result?.status).toBe('completed');
    expect(result?.durationMs).toBeGreaterThanOrEqual(0);
    expect(runFn).toHaveBeenCalledTimes(1);
  });

  it('skips already-completed migrations (idempotent)', async() => {
    const runFn = jest.fn(async() => {});
    registerMigration({
      id: 'test-idempotent',
      targetVersion: 1,
      description: 'Should only run once',
      run: runFn,
    });

    await runPendingMigrations();
    await runPendingMigrations(); // Second run

    expect(runFn).toHaveBeenCalledTimes(1);
    const report = await runPendingMigrations();
    const result = report.migrations.find(m => m.id === 'test-idempotent');
    expect(result?.status).toBe('skipped');
  });

  it('continues running other migrations when one fails', async() => {
    const successFn = jest.fn(async() => {});
    const failFn = jest.fn(async() => {
      throw new Error('Migration failed');
    });

    registerMigration({
      id: 'test-fail-first',
      targetVersion: 1,
      description: 'This will fail',
      run: failFn,
    });
    registerMigration({
      id: 'test-succeed-second',
      targetVersion: 1,
      description: 'This should still run',
      run: successFn,
    });

    const report = await runPendingMigrations();
    const failResult = report.migrations.find(m => m.id === 'test-fail-first');
    const successResult = report.migrations.find(m => m.id === 'test-succeed-second');

    expect(failResult?.status).toBe('failed');
    expect(failResult?.error).toContain('Migration failed');
    expect(successResult?.status).toBe('completed');
    expect(successFn).toHaveBeenCalledTimes(1);
  });

  it('reports diagnostics without content leakage', () => {
    const diag = getMigrationDiagnostics();
    expect(diag).toHaveProperty('pending');
    expect(diag).toHaveProperty('completed');
    expect(diag).toHaveProperty('failed');
    expect(typeof diag.pending).toBe('number');
  });

  it('truncates long error messages to prevent localStorage bloat', async() => {
    const longError = 'E'.repeat(1000);
    registerMigration({
      id: 'test-long-error',
      targetVersion: 1,
      description: 'Throws a long error',
      run: async() => {
        throw new Error(longError);
      },
    });

    await runPendingMigrations();
    const journal = JSON.parse(localStorage.getItem('mangane:db:migration-journal:v1') || '{}');
    const record = journal.migrations?.find((m: any) => m.id === 'test-long-error');
    expect(record?.error?.length).toBeLessThanOrEqual(500);
  });
});
