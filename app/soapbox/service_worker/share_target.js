const MAX_DECLARED_FORM_BYTES = 16 * 1024;
const MAX_NAME_LENGTH = 256;
const MAX_DESCRIPTION_LENGTH = 4096;
const MAX_LINK_LENGTH = 2048;
const ACCEPTED_CONTENT_TYPES = ['application/x-www-form-urlencoded', 'multipart/form-data'];

const boundedText = (value, maxLength) =>
  typeof value === 'string' ? value.replace(/\0/g, '').slice(0, maxLength) : '';

const handleShareRequest = async(request) => {
  const contentType = request.headers.get('content-type') || '';
  if (!ACCEPTED_CONTENT_TYPES.some(type => contentType.toLowerCase().startsWith(type))) {
    return new Response('', { status: 415 });
  }

  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_DECLARED_FORM_BYTES) {
    return new Response('', { status: 413 });
  }

  try {
    const formData = await request.formData();
    const name = boundedText(formData.get('name'), MAX_NAME_LENGTH);
    const description = boundedText(formData.get('description'), MAX_DESCRIPTION_LENGTH);
    const link = boundedText(formData.get('link'), MAX_LINK_LENGTH);
    const text = `${name}\n${description}\n\n${link}`;
    const params = new URLSearchParams();
    params.append('text', text);
    // eslint-disable-next-line compat/compat
    return Response.redirect(`/statuses/compose?${params.toString()}`, 303);
  } catch {
    return new Response('', { status: 400 });
  }
};

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (
    event.request.method === 'POST'
    && requestUrl.origin === self.location.origin
    && requestUrl.pathname === '/share'
  ) {
    event.respondWith(handleShareRequest(event.request));
  }
});
