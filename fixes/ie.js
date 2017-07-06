// IE10 viewport hack for Surface/desktop Windows 8 bug
// See the Getting Started docs for more information:
// https://getbootstrap.com/getting-started/#support-ie10-width
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  const msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode('@-ms-viewport{width:auto!important}'),
  );
  document.head.appendChild(msViewportStyle);
}
