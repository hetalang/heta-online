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
import { requestFileSystemPromise, getFilePromise, createWriterPromise } from './promises'

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
    hmc.addEditor('platform.json', {value: PLATFORM_JSON_TEMPLATE, language: 'json'}, false, true);
    hmc.addEditor('qsp-units.heta', {value: QSP_UNITS_HETA_TEMPLATE, language: 'heta'}, true, false);
    hmc.addEditor('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, false, false);

    // heta exports collection
    let hee = new HetaEditorsCollection({
      panel: '#rightPanel',
      defaultEditor: 'output.log'
    });
    hee.addEditor('output.log', {value: '$ ', language: 'log', readOnly: true, theme: 'vs'}, false, true);

    // create worker and file sytems
    let builderWorker = new Worker(new URL('./build.js', import.meta.url));
    builderWorker.onmessage = function({data}) {
      let he = hee.hetaEditorsStorage.get(data.editor);
      if (data.append) {
        let currentValue = he.monacoEditor.getValue();
        he.monacoEditor.setValue(currentValue + data.value);
      } else {
        he.monacoEditor.setValue(data.value);
      }
    };

    // build button
    $('#buildBtn').on('click', async () => {
      // save all files to web file system      
      let WFS = await requestFileSystemPromise('TEMPORARY', 10*1024*1024);
      for (let he of hmc.hetaEditorsStorage.values()) {
        let text = he.monacoEditor.getValue();
        let data = new Blob([text], { type: "text/plain" });
      let entry = await getFilePromise(WFS, he.id, {create: true});
        let writer = await createWriterPromise(entry);
        writer.write(data);
      }

      // run builder
      builderWorker.postMessage({
        url: WFS.root.toURL()
      });
    });
});

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');

    let h2 = $('#mainDiv').outerHeight() - $('#leftPanel .codeNavigation').outerHeight() - 2;
    $('#leftPanel .codeContainer').height(h2 + 'px');

    let h3 = $('#mainDiv').outerHeight() - $('#rightPanel .codeNavigation').outerHeight() - 2;
    $('#rightPanel .codeContainer').height(h3 + 'px');
}