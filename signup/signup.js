import $ from 'jquery';

const UNKNOWN_ERROR_MESSAGE = 'Oops! Something went wrong. Please try again.';

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
  $('[data-signup-success-hide]').hide();
  const show = $('[data-signup-success-show]');
  show.find('[data-signup-email]').text(email);
  show.show();
};

const showErrorMsg = (options, msg) => {
  const div = options.form.find('[data-error-msg]');
  div.addClass('has-error');
  div.find('.help-block').show().text(msg);
};

const showError = (options, resp) => {
  hideErrors(options);
  try {
    const errors = resp.responseJSON.errors;
    errors.forEach((err) => {
      const field = options.form.find(`[name='${err.field}']`);
      if (field.length) {
        const group = field.parent();
        const help = group.find('.help-block');
        group.addClass('has-error');
        help.text(err.message).show();
      } else {
        const msg = `${err.field}: ${err.message}`;
        showErrorMsg(options, msg);
      }
    });
  } catch (e) {
    const msg = options.settings.i18n && options.settings.i18n.errors
        && options.settings.i18n.errors.unkown;
    showErrorMsg(options, msg || UNKNOWN_ERROR_MESSAGE);
  }
};

const onSuccess = (options, resp) => {
  hideSpinner(options);
  if (resp.status === 'OK') {
    showSuccess(options);
    if (options.settings.success) {
      options.settings.success(options, resp);
    }
  } else {
    showError(options, resp);
  }
};

const onError = (options, resp) => {
  hideSpinner(options);
  showError(options, resp);
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
  const data = {};
  options.form.serializeArray().forEach(x => (data[x.name] = x.value));
  $.ajax({
    url: options.settings.url,
    method: 'POST',
    data: JSON.stringify(data),
    success: onSuccess.bind(onSuccess, options),
    dataType: 'json',
    error: onError.bind(onError, options),
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
      url: form.attr('action'),
      language: 'en',
      ...options,
    },
  };
  form.attr('novalidate', 'true');
  email.attr('name', 'email');
  form.submit(submit.bind(submit, opts));
};


export default setup;
