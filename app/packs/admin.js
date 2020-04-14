'use strict';

import { delegate } from 'rails-ujs';

const batchCheckboxClassName = '.batch-checkbox input[type="checkbox"]';

delegate(document, '#batch_checkbox_all', 'change', ({ target }) => {
  [].forEach.call(document.querySelectorAll(batchCheckboxClassName), (content) => {
    content.checked = target.checked;
  });
});

delegate(document, batchCheckboxClassName, 'change', () => {
  const checkAllElement = document.querySelector('#batch_checkbox_all');

  if (checkAllElement) {
    checkAllElement.checked = [].every.call(document.querySelectorAll(batchCheckboxClassName), (content) => content.checked);
    checkAllElement.indeterminate = !checkAllElement.checked && [].some.call(document.querySelectorAll(batchCheckboxClassName), (content) => content.checked);
  }
});

delegate(document, '.media-spoiler-show-button', 'click', () => {
  [].forEach.call(document.querySelectorAll('button.media-spoiler'), (element) => {
    element.click();
  });
});

delegate(document, '.media-spoiler-hide-button', 'click', () => {
  [].forEach.call(document.querySelectorAll('.spoiler-button.spoiler-button--visible button'), (element) => {
    element.click();
  });
});

delegate(document, '#domain_block_severity', 'change', ({ target }) => {
  const rejectMediaDiv   = document.querySelector('.input.with_label.domain_block_reject_media');
  const rejectReportsDiv = document.querySelector('.input.with_label.domain_block_reject_reports');

  if (rejectMediaDiv) {
    rejectMediaDiv.style.display = (target.value === 'suspend') ? 'none' : 'block';
  }

  if (rejectReportsDiv) {
    rejectReportsDiv.style.display = (target.value === 'suspend') ? 'none' : 'block';
  }
});

delegate(document, '.btngroup__btn', 'click', ({ target: btn }) => {
  const btngroup = btn.parentElement;
  const btngroup_sets = document.querySelector(btngroup.dataset.sets);
  const btngroup_shows = document.querySelector(btngroup.dataset.shows);

  const btn_shows = document.querySelector(btn.dataset.shows);
  const btn_hides = document.querySelector(btn.dataset.hides);
  const btn_focuses = document.querySelector(btn.dataset.focuses);
  const btn_value = btn.dataset.value;

  // Reset other button states
  btngroup.querySelectorAll('.btngroup__btn').forEach((other_btn) => {
    const other_btn_shows = document.querySelector(other_btn.dataset.shows);
    const other_btn_hides = document.querySelector(other_btn.dataset.hides);
    if (other_btn_shows) {
      other_btn_shows.style.display = 'none';
    }
    if (other_btn_hides) {
      other_btn_hides.style.display = '';
    }
    other_btn.classList.remove('btngroup__btn--active');
  });

  // Set given input
  if (btngroup_sets) {
    btngroup_sets.value = btn_value;
  }

  // Highlight current button
  btn.classList.add('btngroup__btn--active');

  // Set visibility of given elements
  if (btn_shows) {
    btn_shows.style.display = '';
  }
  if (btngroup_shows) {
    btngroup_shows.style.display = '';
  }
  if (btn_hides) {
    btn_hides.style.display = 'none';
  }

  // Focus given elements
  if (btn_focuses) {
    btn_focuses.focus();
  }

  return false; // Prevent form submit
});

delegate(document, '.payform', 'submit', (e) => {
  e.preventDefault();
  document.getElementById('paybtn').disabled = true;

  const stripe_pk = document.querySelector('meta[name=\'stripe-pk\']').content;
  const csrf_token = document.querySelector('meta[name=\'csrf-token\']').content;
  const price = Math.floor(document.getElementById('price').value.replace(/[^0-9.]/, '') * 100);

  const stripe = Stripe(stripe_pk);
  const req = new XMLHttpRequest();

  function checkout () {
    stripe.redirectToCheckout({
      sessionId: this.responseText,
    }).then(function (result) {
      console.log(result.error.message);
    });
  }

  req.addEventListener('load', checkout);
  req.open('POST', '/donate/stripe');
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.setRequestHeader('X-CSRF-Token', csrf_token);
  req.send('amount=' + price);
});
