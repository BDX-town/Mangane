import { isIntegerId } from 'soapbox/utils/numbers';

export const getFirstExternalLink = status => {
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

export const shouldHaveCard = status => {
  return Boolean(getFirstExternalLink(status));
};

// https://gitlab.com/soapbox-pub/soapbox-fe/-/merge_requests/1087
export const hasIntegerMediaIds = status => {
  return status.media_attachments.some(({ id }) => isIntegerId(id));
};
