/** Convert HTML to a plaintext representation, preserving whitespace. */
// NB: This function can still return unsafe HTML
export const unescapeHTML = (html: string): string => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p><[^>]*>/g, '\n\n').replace(/<[^>]*>/g, '');
  return wrapper.textContent || '';
};

/** Remove compatibility markup for features Soapbox supports. */
export const stripCompatibilityFeatures = (html: string): string => {
  const node = document.createElement('div');
  node.innerHTML = html;

  const selectors = [
    // Quote posting
    '.quote-inline',
    // Explicit mentions
    '.recipients-inline',
  ];

  // Remove all instances of all selectors
  selectors.forEach(selector => {
    node.querySelectorAll(selector).forEach(elem => {
      elem.remove();
    });
  });

  return node.innerHTML;
};
