// Imports
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const path = require('path');
const i18n = require('../../../helper/i18n');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');
const loaderService = require('../../service/loader');
const loader = loaderService.getLoader();

// Variables
const scope = {};

// Codes
i18n.config(path.join(__dirname, '../../../../locales'));