// NB: This function can still return unsafe HTML
export const unescapeHTML = (html) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p><[^>]*>/g, '\n\n').replace(/<[^>]*>/g, '');
  return wrapper.textContent;
};

export const stripCompatibilityFeatures = html => {
  const node = document.createElement('div');
  node.innerHTML = html;

  const selectors = [
    '.quote-inline',
    '.recipients-inline',
  ];

  selectors.forEach(selector => {
    const elem = node.querySelector(selector);

    if (elem) {
      elem.remove();
    }
  });

  return node.innerHTML;
};
