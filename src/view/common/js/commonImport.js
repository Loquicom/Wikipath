const $ = require('jquery');
const { ipcRenderer } = require('electron');
const routerService = require('../../service/router');
const dialogService = require('../../service/dialog');
const loaderService = require('../../service/loader');
const loader = loaderService.getLoader();