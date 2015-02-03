'use strict';

require('6to5/polyfill');

require('bootstrap');

import React from 'react';
import App from './js/views/app.js';

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);
