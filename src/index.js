// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
//import * as monaco from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

$(window).on('resize', updateWindowHeight);

// Events

// document ready
$(() => {
    updateWindowHeight();
    monaco.editor.create(document.getElementById('indexHetaContainer'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript'
    });
});

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');
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