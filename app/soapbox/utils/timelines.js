import { Map as ImmutableMap } from 'immutable';

export const shouldFilter = (status, columnSettings) => {
  const shows = ImmutableMap({
    reblog: status.get('reblog') !== null,
    reply: status.get('in_reply_to_id') !== null,
    direct: status.get('visibility') === 'direct',
  });

  return shows.some((value, key) => {
    return columnSettings.getIn(['shows', key]) === false && value;
  });
};
