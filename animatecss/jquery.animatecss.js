// eslint-disable-next-line
import $ from 'jquery';

$.fn.extend({
  // eslint-disable-next-line object-shorthand, func-names
  animateCss: function (animationName, speed) {
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd ' +
      'oanimationend animationend';
    if (parseInt(speed, 10)) {
      this.css({
        '-webkit-animation-duration': speed,
        'animation-duration': speed,
      });
    }
    this.addClass(`animated ${animationName}`).one(animationEnd, () => {
      $(this).removeClass(`animated ${animationName}`);
    });
  },
});
