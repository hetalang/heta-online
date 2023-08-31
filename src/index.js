// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
window.$ = $;

//import * as monaco from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import HetaEditorsCollection from './heta-editor';

$(window).on('resize', updateWindowHeight);

// Events

// document ready
$(() => {
    updateWindowHeight();

    window.hetaEditorsCollection = HetaEditorsCollection.createWithDefaults();

    monaco.editor.create(document.getElementById('consoleLog'), {
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
      language: 'json',
      readOnly: true,
      mode: 'dark'
  });
});

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');

    let h2 = $('#mainDiv').outerHeight() - $('#codeNaviLeft').outerHeight() - 2;
    $('#codeContainerLeft').height(h2 + 'px');

    let h3 = $('#mainDiv').outerHeight() - $('#codeNaviRight').outerHeight() - 2;
    $('#codeContainerRight').height(h3 + 'px');
}
