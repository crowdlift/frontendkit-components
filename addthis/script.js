import loadScript from '../utils/loadscript';

const SCRIPT_BASE = '//s7.addthis.com/js/300/addthis_widget.js#pubid=';

const load = (pubid, callback) => {
  return loadScript(`${SCRIPT_BASE}${pubid}`, callback);
};

// Load script and wait for DOM
const wait = (pubid, callback) => {
  return load(pubid, () => $(document).ready(callback));
};

export {
  load,
  wait,
};
