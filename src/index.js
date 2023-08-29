// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
window.$ = $;

//import * as monaco from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import HetaPanelContainer from './heta-panel';

$(window).on('resize', updateWindowHeight);

// Events

// document ready
$(() => {
    updateWindowHeight();

    window.hetaPanelContainer = HetaPanelContainer.createWithDefaults();

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

/*
//  This modul imports different types of modules


#setNS {space: one, type: abstract};

include json.json type json

include heta.heta type heta

include yaml.yml type yaml

include xlsx.xlsx type xlsx with {
  options: { sheetNum: [0, 1], omitRows: 3 }
}

include page.md type md with {
  options: {pageId: xxx},
  id: yyy,
  title: hhh
};

#export {format: YAML, filepath: yaml};
*/