import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';

// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
//window.$ = $; // set as global

import HetaEditorsCollection from './heta-editor';

$(window).on('resize', updateWindowHeight);

import hetaPackage from 'heta-compiler/package';
import { Container } from 'heta-compiler/src/browser';

// document ready
$(() => {
    updateWindowHeight();
    $('#hc-version').text(hetaPackage.version);
    $('#hc-github').attr('href', hetaPackage.repository.url);
    $('#hc-homepage').attr('href', hetaPackage.homepage);
    //console.log(hetaPackage);

    // heta modules collection
    let hmc = new HetaEditorsCollection({
      newButton: '#newButton',
      panel: '#leftPanel',
      defaultEditor: 'index.heta'
    });
    hmc.addEditor('platform.json', PLATFORM_JSON_TEMPLATE, 'json', false, true);
    hmc.addEditor('qsp-units.heta', QSP_UNITS_HETA_TEMPLATE, 'heta');
    hmc.addEditor('index.heta', INDEX_HETA_TEMPLATE, 'heta', false, false);

    // heta exports collection
    let hee = new HetaEditorsCollection({
      panel: '#rightPanel',
      defaultEditor: 'output.log'
    });
    hee.addEditor('output.json', 'I am JsonExport', 'json', false, false);
    hee.addEditor('output.m', 'I am MatlabExport', 'json', false, false);
    hee.addEditor('output.log', 'I am Logger', 'log', false, true);
});

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');

    let h2 = $('#mainDiv').outerHeight() - $('#leftPanel .codeNavigation').outerHeight() - 2;
    $('#leftPanel .codeContainer').height(h2 + 'px');

    let h3 = $('#mainDiv').outerHeight() - $('#rightPanel .codeNavigation').outerHeight() - 2;
    $('#rightPanel .codeContainer').height(h3 + 'px');
}