type BoundedStepStatus = 'completed' | 'failed' | 'timed-out';

interface BoundedStepResult {
  step: string,
  status: BoundedStepStatus,
}

const TIMEOUT = Symbol('bounded-step-timeout');

const withTimeout = async<T>(operation: Promise<T>, timeout: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(TIMEOUT), timeout);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
};

const runBoundedStep = async(
  results: BoundedStepResult[],
  step: string,
  operation: () => void | Promise<unknown>,
  timeout: number,
): Promise<void> => {
  try {
    await withTimeout(Promise.resolve().then(operation), timeout);
    results.push({ step, status: 'completed' });
  } catch (error) {
    results.push({
      step,
      status: error === TIMEOUT ? 'timed-out' : 'failed',
    });
  }
};

export { runBoundedStep };

export type { BoundedStepResult, BoundedStepStatus };
