// https://developers.google.com/youtube/iframe_api_reference
// Also see https://github.com/gajus/youtube-player

// http://thenewcode.com/777/Create-Fullscreen-HTML5-Page-Background-Video
// https://codepen.io/dudleystorey/pen/knqyK
// video.fullscreen {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   min-width: 100%;
//   min-height: 100%;
//   width: auto;
//   height: auto;
//   z-index: -100;
//   transform: translate(-50%, -50%);
// }

import { debounce } from 'lodash';

// getAttribute('href')
let config = {
  playerCssClass: 'video-player',
  playerContainers: null,
};

const setConfig = opts =>
  (config = { ...config, ...opts });

const getRandPlayerName = () => {
  const i = Math.floor((Math.random() * 100000));
  return `ytplayer-${i}`;
};

const createPlayer = (container) => {
  const div = container.firstChild;

  let id = div.getAttribute('id');
  if (!id) {
    id = getRandPlayerName();
    div.setAttribute('id', id);
  }
  const href = container.getAttribute('data-video-url');
  const videoId = href.match(/\?.*v=([^&]+)/)[1];
  const YT = window.YT;
  return new YT.Player(id, {
    width: '1280',
    height: '800',
    videoId,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      autoplay: 1,
      cc_load_policy: 0,
      color: 'white',
      controls: 0,
      disablekb: 1,
      iv_load_policy: 3,
      loop: 1,
      modestbranding: 1,
      playlist: videoId,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
    },
    // events: {
    //   'onReady': onPlayerReady,
    //   'onStateChange': onPlayerStateChange
    // }
  });
};

const resizePlayer = (container) => {
  const player = container.firstChild;
  const width = player.getAttribute('width');
  const height = player.getAttribute('height');
  const ratio = width / height;
  let newWidth = container.clientWidth;
  for (let i = newWidth; i > newWidth - 100; i -= 1) {
    if (Number.isInteger(i / ratio)) {
      newWidth = i;
      break;
    }
  }
  player.setAttribute('width', newWidth);
  player.setAttribute('height', Math.round(newWidth / ratio));
};

const initPlayers = () => {
  if (!config.playerContainers) {
    config.playerContainers = document.getElementsByClassName(config.playerCssClass) || [];
  }
  Array.from(config.playerContainers).forEach((div) => {
    createPlayer(div);
  });
};

const onWindowResize = () => {
  Array.from(config.playerContainers).forEach((div) => {
    resizePlayer(div);
  });
};

const onYouTubeIframeAPIReady = () => {
  initPlayers();
  onWindowResize();
};

const init = (opts = {}) => {
  setConfig(opts);

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

  const resize = debounce(onWindowResize, 250, { maxWait: 1000 });
  window.addEventListener('resize', resize);
};

export {
  init,
  createPlayer,
};
