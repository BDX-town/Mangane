import { recoverAncestorContext } from '../context-recovery';

const status = (id: string, inReplyToId: string | null = null) => ({
  id,
  in_reply_to_id: inReplyToId,
}) as any;

const httpError = (statusCode: number) => ({ response: { status: statusCode } });

describe('recoverAncestorContext', () => {
  it('reuses Mitra array context without redundant fetches', async() => {
    const fetchStatusById = jest.fn();

    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent'),
      knownStatuses: [status('root'), status('parent', 'root')],
      fetchStatusById,
    });

    expect(result.ancestors.map(item => item.id)).toEqual(['root', 'parent']);
    expect(result.outcome).toBe('complete');
    expect(fetchStatusById).not.toHaveBeenCalled();
  });

  it('fetches only missing links and reports repaired context', async() => {
    const fetchStatusById = jest.fn(async(id: string) => status(id, id === 'parent' ? 'root' : null));

    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent'),
      knownStatuses: [status('root')],
      fetchStatusById,
    });

    expect(result.ancestors.map(item => item.id)).toEqual(['root', 'parent']);
    expect(result.fetched.map(item => item.id)).toEqual(['parent']);
    expect(result.outcome).toBe('repaired');
    expect(fetchStatusById).toHaveBeenCalledTimes(1);
  });

  it.each([
    [401, 'partial-unauthorized'],
    [403, 'partial-unauthorized'],
    [404, 'partial-unavailable'],
    [410, 'partial-unavailable'],
    [500, 'partial-network'],
  ])('classifies parent fetch HTTP %s as %s', async(statusCode, expectedOutcome) => {
    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent'),
      knownStatuses: [],
      fetchStatusById: async() => Promise.reject(httpError(statusCode as number)),
    });

    expect(result.outcome).toBe(expectedOutcome);
    expect(result.missingParentId).toBe('parent');
  });

  it('rejects mismatched parent entities', async() => {
    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent'),
      knownStatuses: [],
      fetchStatusById: async() => status('different'),
    });

    expect(result.outcome).toBe('partial-malformed');
    expect(result.ancestors).toEqual([]);
  });

  it('detects cycles', async() => {
    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent'),
      knownStatuses: [status('parent', 'reply')],
      fetchStatusById: jest.fn(),
    });

    expect(result.outcome).toBe('cycle-detected');
    expect(result.ancestors.map(item => item.id)).toEqual(['parent']);
  });

  it('bounds hostile ancestor depth', async() => {
    const result = await recoverAncestorContext({
      focusedStatus: status('reply', 'parent-0'),
      knownStatuses: [],
      fetchStatusById: async(id: string) => {
        const index = Number(id.replace('parent-', ''));
        return status(id, `parent-${index + 1}`);
      },
      maxDepth: 3,
    });

    expect(result.outcome).toBe('depth-truncated');
    expect(result.ancestors.map(item => item.id)).toEqual(['parent-2', 'parent-1', 'parent-0']);
    expect(result.missingParentId).toBe('parent-3');
  });
});
