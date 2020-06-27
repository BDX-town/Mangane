'use strict';

import Rails from 'rails-ujs';

export function start() {
  require('fork-awesome/css/fork-awesome.css');
  require.context('../images/', true);

  try {
    Rails.start();
  } catch (e) {
    // If called twice
  }
};
