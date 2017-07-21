import $ from 'jquery';


/**
https://github.com/scdoshi/jquery-ajaxchimp/blob/master/jquery.ajaxchimp.js

Use:
===
$('#form_id').ajaxchimp(options);


Notes:
=====
To get the mailchimp JSONP url (undocumented), change 'post?' to
'post-json?' and add '&c=?' to the end.
For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
**/


// See MailChimp embedded forms code to get the official order for each form.
// Order likely changes when fields are added to the MailChimp list.
const fieldsOrder = [
  'EMAIL',
  'FNAME',
  'LNAME',
];


$.ajaxChimp = {
  init: (selector, options) =>
    $(selector).ajaxChimp(options),
};

const hideErrors = (options) => {
  options.form.find('.has-error').removeClass('has-error');
  options.form.find('.help-block').hide();
};

const showSpinner = (options) => {
  const btn = options.form.find('[type="submit"]');
  btn.find('.spinner').show();
  btn.find('span').hide();
};

const hideSpinner = (options) => {
  const btn = options.form.find('[type="submit"]');
  btn.find('.spinner').hide();
  btn.find('span').show();
};

const showSuccess = (options) => {
  hideErrors(options);
  const email = options.form.find("[data-signup-field='email']").val();
  $('[data-mc-success-hide]').hide();
  const show = $('[data-mc-success-show]');
  show.find('[data-mc-email]').text(email);
  show.show();
};

const showErrorMsg = (options, msg) => {
  const div = options.form.find('[data-error-msg]');
  div.addClass('has-error');
  div.find('.help-block').show().html(msg);
};

const showError = (options, resp) => {
  hideErrors(options);
  try {
    const parts = resp.msg.split(' - ', 2);
    if ((parts[1] !== undefined) && (parseInt(parts[0], 10).toString() === parts[0])) {
      const name = fieldsOrder[[parts[0]]];
      const field = options.form.find(`[name='${name}']`);
      const group = field.parent();
      const help = group.find('.help-block');
      group.addClass('has-error');
      help.html(parts[1]).show();
    } else {
      showErrorMsg(options, resp.msg);
    }
  } catch (e) {
    // do nothing
  }
};

const onSuccess = (options, resp) => {
  hideSpinner(options);
  if (resp.result === 'success') {
    showSuccess(options);
    if (options.settings.success) {
      options.settings.success(options, resp);
    }
  } else {
    showError(options, resp);
  }
};


const validate = (evt, options) => {
  const form = options.form;
  const btn = form.find('[type="submit"]');
  let ret = true;
  if (form.validator) form.validator('validate');
  if (btn.prop('disabled') || btn.hasClass('disabled')) {
    evt.preventDefault();
    btn.animateCss('shake');
    ret = false;
  } else {
    btn.addClass('disabled');
    showSpinner(options);
  }
  return ret;
};

const ajaxSubmit = (options) => {
  $.ajax({
    url: options.settings.url,
    data: options.form.serializeArray(),
    success: onSuccess.bind(onSuccess, options),
    dataType: 'jsonp',
    error: (resp, text) => {
      // eslint-disable-next-line no-console
      console.log(`mailchimp ajax submit error: ${text}`);
    },
  });
  return false;
};

const submit = (options, evt) =>
  (validate(evt, options) ? ajaxSubmit(options) : false);

const setup = (elem, options) => {
  const form = (elem.tagName === 'FORM') ? $(elem) : $(elem).find('form');
  const email = form.find('input[type=email]');
  const opts = {
    form,
    email,
    settings: {
      url: form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
      language: 'en',
      ...options,
    },
  };
  form.attr('novalidate', 'true');
  email.attr('name', 'EMAIL');
  form.submit(submit.bind(submit, opts));
};

$.fn.ajaxChimp = function ajaxChimp(options = {}) {
  this.filter('form').toArray().forEach(elem => setup(elem, options));
  return this;
};

export default setup;
