// Load script and optionally trigger callback
// https://stackoverflow.com/questions/7718935/load-scripts-asynchronously
const loadScript = (doc, src, callback) => {
  let done = false;
  const script = doc.createElement('script');
  script.src = src;
  script.async = 1;
  script.onload = script.onreadystatechange = function loaded() {
    // Uncomment next line to see which ready states are called
    // console.log( this.readyState );
    if (!done && (!this.readyState || this.readyState == 'complete')) {
      done = true;
      if (typeof callback === 'function') {
        callback();
      }
    }
  };
  const dom = doc.getElementsByTagName('script')[0];
  dom.parentNode.insertBefore(script, dom);
  return script;
};

export default loadScript.bind(loadScript, window.document);
