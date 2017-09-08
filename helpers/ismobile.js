const isPhoneDevice = 'ontouchstart' in document.documentElement;
const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
export default (isPhoneDevice || isMobile);
