self.addEventListener('fetch', (event) => {
  // Regular requests not related to Web Share Target.
  if (event.request.method === 'POST' && event.request.url.includes('/share')) {
    // Requests related to Web Share Target.
    event.respondWith(
      (async() => {
        const formData = await event.request.formData();
        const name = formData.get('name') || '';
        const description = formData.get('description') || '';
        const link = formData.get('link') || '';
        const text = `${name}\n${description}\n\n${link}`;
        const params = new URLSearchParams();
        params.append('text', text);
        // eslint-disable-next-line compat/compat
        return Response.redirect(`/statuses/compose?${params.toString()}`, 303);
      })());
  }
});