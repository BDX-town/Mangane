/**
 * Admin report normalizer:
 * Converts API admin-level report information into our internal format.
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import type { ReducerAccount } from 'soapbox/reducers/accounts';
import type { Account, EmbeddedEntity, Status } from 'soapbox/types/entities';

export const AdminReportRecord = ImmutableRecord({
  account: null as EmbeddedEntity<Account | ReducerAccount>,
  action_taken: false,
  action_taken_by_account: null as EmbeddedEntity<Account | ReducerAccount> | null,
  assigned_account: null as EmbeddedEntity<Account | ReducerAccount> | null,
  category: '',
  comment: '',
  created_at: new Date(),
  id: '',
  rules: ImmutableList<string>(),
  statuses: ImmutableList<EmbeddedEntity<Status>>(),
  target_account: null as EmbeddedEntity<Account | ReducerAccount>,
  updated_at:  new Date(),
});

const normalizePleromaReport = (report: ImmutableMap<string, any>) => {
  if (report.get('actor')){
    return report.withMutations(report => {
      report.set('target_account', report.get('account'));
      report.set('account', report.get('actor'));

      report.set('action_taken', report.get('state') !== 'open');
      report.set('comment', report.get('content'));
      report.set('updated_at', report.get('created_at'));
    });
  }

  return report;
};

export const normalizeAdminReport = (report: Record<string, any>) => {
  return AdminReportRecord(
    ImmutableMap(fromJS(report)).withMutations((report: ImmutableMap<string, any>) => {
      normalizePleromaReport(report);
    }),
  );
};
