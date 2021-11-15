export const getHost = instance => {
  try {
    return new URL(instance.get('uri')).host;
  } catch {
    try {
      return new URL(`https://${instance.get('uri')}`).host;
    } catch {
      return null;
    }
  }
};
