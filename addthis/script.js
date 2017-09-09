import loadScript from '../utils/loadscript';

const load = (url, callback) => {
  return loadScript(url, callback);
};

// Load script and wait for DOM
const wait = (url, callback) => {
  return load(url, () => $(document).ready(callback));
};

const init = (config = process.env.social) => {
  const addthis_share = window.addthis_share || {};
  if (config.twitter.handle) {
    addthis_share.passthrough = {
      twitter: {
        via: config.twitter.handle,
        text: config.twitter.title || undefined,
      },
    };
  }
  // Use global share URL if present
  // This is useful when A/B testing landing page URLs but wanting to share a different URL
  if (config.addthis.shareURL) {
    addthis_share.url = config.addthis.shareURL;
  }
  window.addthis_share = addthis_share;
};

export {
  init,
  load,
  wait,
};
