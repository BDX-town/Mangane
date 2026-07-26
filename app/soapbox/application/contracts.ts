import type { AccountScope } from 'soapbox/domain/account-scope';

type ExecutionContext = Readonly<{
  scope: AccountScope;
  signal?: AbortSignal;
}>;

interface QueryHandler<Query, Result> {
  execute(query: Query, context: ExecutionContext): Promise<Result>;
}

interface CommandHandler<Command, Result> {
  execute(command: Command, context: ExecutionContext): Promise<Result>;
}

export type {
  CommandHandler,
  ExecutionContext,
  QueryHandler,
};
