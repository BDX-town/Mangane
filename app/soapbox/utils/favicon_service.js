// Adapted from Pleroma FE
// https://git.pleroma.social/pleroma/pleroma-fe/-/blob/ef5bbc4e5f84bb9e8da76a0440eea5d656d36977/src/services/favicon_service/favicon_service.js

const createFaviconService = () => {
  const favicons = [];
  const faviconWidth = 128;
  const faviconHeight = 128;
  const badgeRadius = 24;

  const initFaviconService = () => {
    const nodes = document.querySelectorAll('link[rel="icon"]');
    nodes.forEach(favicon => {
      if (favicon) {
        const favcanvas = document.createElement('canvas');
        favcanvas.width = faviconWidth;
        favcanvas.height = faviconHeight;
        const favimg = new Image();
        favimg.crossOrigin = 'anonymous';
        favimg.src = favicon.href;
        const favcontext = favcanvas.getContext('2d');
        favicons.push({ favcanvas, favimg, favcontext, favicon });
      }
    });
  };

  const isImageLoaded = (img) => img.complete && img.naturalHeight !== 0;

  const clearFaviconBadge = () => {
    if (favicons.length === 0) return;
    favicons.forEach(({ favimg, favcanvas, favcontext, favicon }) => {
      if (!favimg || !favcontext || !favicon) return;
      favcontext.clearRect(0, 0, faviconWidth, faviconHeight);
      if (isImageLoaded(favimg)) {
        favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight);
      }
      favicon.href = favcanvas.toDataURL('image/png');
    });
  };

  const drawFaviconBadge = () => {
    if (favicons.length === 0) return;
    clearFaviconBadge();
    favicons.forEach(({ favimg, favcanvas, favcontext, favicon }) => {
      if (!favimg || !favcontext || !favcontext) return;

      const style = getComputedStyle(document.body);
      const badgeColor = `${style.getPropertyValue('--badge-notification') || 'rgb(255, 0, 0)'}`;

      if (isImageLoaded(favimg)) {
        favcontext.drawImage(favimg, 0, 0, favimg.width, favimg.height, 0, 0, faviconWidth, faviconHeight);
      }
      favcontext.fillStyle = badgeColor;
      favcontext.beginPath();
      favcontext.arc(faviconWidth - badgeRadius, badgeRadius, badgeRadius, 0, 2 * Math.PI, false);
      favcontext.fill();
      favicon.href = favcanvas.toDataURL('image/png');
    });
  };

  return {
    initFaviconService,
    clearFaviconBadge,
    drawFaviconBadge,
  };
};

const FaviconService = createFaviconService();

export default FaviconService;
