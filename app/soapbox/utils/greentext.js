import { processHtml } from './tiny_post_html_processor';

export const addGreentext = html => {
  // Copied from Pleroma FE
  // https://git.pleroma.social/pleroma/pleroma-fe/-/blob/19475ba356c3fd6c54ca0306d3ae392358c212d1/src/components/status_content/status_content.js#L132
  return processHtml(html, (string) => {
    try {
      if (string.includes('&gt;') &&
          string
            .replace(/<[^>]+?>/gi, '') // remove all tags
            .replace(/@\w+/gi, '') // remove mentions (even failed ones)
            .trim()
            .startsWith('&gt;')) {
        return `<span class='greentext'>${string}</span>`;
      } else {
        return string;
      }
    } catch(e) {
      return string;
    }
  });
};
