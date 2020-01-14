import 'core-js';
import "core-js/modules/es6.function.name";
import underscoreDeepExtend from 'underscore-deep-extend';
import moment from 'moment';
import {FontAwesomeRegister} from "@/config/font-awesome-register";

// load jquery
require('jquery');

// load jquery ui
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';

// load timepicker
require('@/assets/js/jquery.timepicker.min');
require('@/assets/css/jquery.timepicker.min.css');
require('@/assets/css/v-form.css');

// load bootstrap
require('popper.js');
require('bootstrap');
// import 'bootstrap/dist/css/bootstrap.min.css';
// require('scriptjs');

// load font-awesome
FontAwesomeRegister.register();

// load underscore
window._ = require('underscore'); // override
require('@/config/helper_function');
_.mixin({deepExtend: underscoreDeepExtend(_)});

import('@/assets/js/jquery.noty.packaged');
require('@/assets/js/validate.min.js');
