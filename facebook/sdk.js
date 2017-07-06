let options = {
  // Facebook SDK
  scope: 'public_profile,email',
  fields: 'email,first_name,last_name',
  version: 'v2.8',

  // Array of DOM elements or jQuery object
  loginButtons: [],

  // Callbacks
  onStatus: null,
  onData: null,

  // Enable debugging
  debug: false,
};

const setOptions = opts =>
  (options = { ...options, ...opts });

const runCallback = (cb, payload) => {
  if (typeof cb === 'function') {
    cb(options, payload);
  }
};


const fetchData = () => {
  window.FB.api(`/me?fields=${options.fields}`, (response) => {
    if (!response || response.error) {
      // eslint-disable-next-line no-console
      console.log('Unable to get FB data: ', response.error);
    }
    runCallback(options.onData, response);
  });
};

const onStatus = (response) => {
  switch (response.status) {
    case 'connected':
      // Person is logged into the app
      fetchData();
      break;
    case 'not_authorized':
      // Person is logged into Facebook but not logged into the app
      break;
    case 'unknown':
      // Person is not logged into Facebook
      break;
    default:
      break;
  }
  runCallback(options.onStatus, response);
};

const fbAsyncInit = () => {
  window.FB.init({
    appId: process.env.social.facebook.appID,
    cookie: true,
    xfbml: true,
    status: true,
    version: options.version,
  });
  window.FB.getLoginStatus(onStatus);
};

const initDOM = () => {
  // Add fb-root if ndded
  if (!document.getElementById('fb-root')) {
    const div = document.createElement('div');
    div.id = 'fb-root';
    document.body.appendChild(div);
  }

  // Add login buttons click handlers
  // Convert jQuery object to array if needed
  const buttons = Array.isArray(options.loginButtons)
    ? options.loginButtons
    : options.loginButtons.toArray();
  const onClick = (evt) => {
    evt.preventDefault();
    if (window.FB && window.FB.login) {
      window.FB.login(onStatus, { scope: options.scope });
    }
  };
  buttons.forEach(elem =>
    // eslint-disable-next-line no-param-reassign
    (elem.onclick = onClick),
  );
};

const initSDK = (d, s, id) => {
  const fjs = d.getElementsByTagName(s)[0];
  if (!d.getElementById(id)) {
    const js = d.createElement(s); js.id = id;
    if (options.debug) {
      js.src = '//connect.facebook.net/en_US/sdk/debug.js';
    } else {
      js.src = '//connect.facebook.net/en_US/sdk.js';
    }
    fjs.parentNode.insertBefore(js, fjs);
  }
};

const init = (opts) => {
  setOptions(opts);
  window.fbAsyncInit = fbAsyncInit;
  initDOM();
  initSDK(document, 'script', 'facebook-jssdk');
};

export {
  init,
  setOptions,
};
