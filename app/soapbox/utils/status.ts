import { isIntegerId } from 'soapbox/utils/numbers';

import type { Status as StatusEntity } from 'soapbox/types/entities';

/** Grab the first external link from a status. */
export const getFirstExternalLink = (status: StatusEntity): HTMLAnchorElement | null => {
  try {
    // Pulled from Pleroma's media parser
    const selector = 'a:not(.mention,.hashtag,.attachment,[rel~="tag"])';
    const element = document.createElement('div');
    element.innerHTML = status.content;
    return element.querySelector(selector);
  } catch {
    return null;
  }
};

/** Whether the status is expected to have a Card after it loads. */
export const shouldHaveCard = (status: StatusEntity): boolean => {
  return Boolean(getFirstExternalLink(status));
};

/** Whether the media IDs on this status have integer IDs (opposed to FlakeIds). */
// https://gitlab.com/soapbox-pub/soapbox-fe/-/merge_requests/1087
export const hasIntegerMediaIds = (status: StatusEntity): boolean => {
  return status.media_attachments.some(({ id }) => isIntegerId(id));
};
