'use strict';

import Rails from 'rails-ujs';

export function start() {
  require('fork-awesome/css/fork-awesome.css');
  require('@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css');
  require('@fonticonpicker/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css');
  require.context('../images/', true);

  try {
    Rails.start();
  } catch (e) {
    // If called twice
  }
};
