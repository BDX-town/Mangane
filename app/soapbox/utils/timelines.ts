import { Map as ImmutableMap } from 'immutable';

import { ReducerStatus } from 'soapbox/reducers/statuses';

import type { Status as StatusEntity } from 'soapbox/types/entities';

export const shouldFilter = (status: StatusEntity, columnSettings: any) => {
  const shows = ImmutableMap({
    reblog: status.reblog !== null,
    reply: status.in_reply_to_id !== null,
    direct: status.visibility === 'direct',
  });

  return shows.some((value, key) => {
    return columnSettings.getIn(['shows', key]) === false && value;
  });
};

/**
 * We dont want status to show status multiple times when there are reblogged (maybe multiple times)
 * @param status
 * @param reblogs
 * @returns
 */
export const shoulDedupReblog = (status: ReducerStatus, reblogs: {[x: string]: ReducerStatus[] }) => {
  // we already encoutered a reblog so we dont show the original
  if (reblogs[status.id]) {
    return true;
  }
  // this status isnt a reblog
  if (!status.reblog) return false;
  // this status is a reblog and it's the first time the reblog is encountered
  if (!reblogs[status.reblog]) {
    reblogs[status.reblog] = [status];
    return false;
  }
  // this status is a reblog and it's not the first time the reblog is encountered, so we hide it
  reblogs[status.reblog] = [...reblogs[status.reblog], status];
  return true;
};