import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';

// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';

// Auxilary
import $ from 'jquery';
//window.$ = $; // set as global

import {PagesCollection, EditorPage, ConsolePage} from './heta-editor';

$(window).on('resize', updateWindowHeight);

import hetaPackage from 'heta-compiler/package';
import { requestFileSystemPromise, getFilePromise, createWriterPromise, cleanDirectoryPromise } from './promises'

// document ready
$(() => { 
    $('#hc-version').text(hetaPackage.version);
    $('#hc-github').attr('href', hetaPackage.repository.url);
    $('#hc-homepage').attr('href', hetaPackage.homepage);
    //console.log(hetaPackage);

    // heta modules collection
    let hmc = window.hmc = new PagesCollection({
      newButton: '#newButton',
      panel: '#leftPanel'
    });

    new EditorPage('platform.json', {value: PLATFORM_JSON_TEMPLATE, language: 'json'}, false, true)
      .addTo(hmc);
    new EditorPage('qsp-units.heta', {value: QSP_UNITS_HETA_TEMPLATE, language: 'heta'}, true, false)
      .addTo(hmc);
    new EditorPage('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, false, false)
      .addTo(hmc, true);


    // heta exports collection
    let hee = window.hee = new PagesCollection({
      panel: '#rightPanel'
    });

    new ConsolePage('CONSOLE')
      .addTo(hee, true)
      .appendText('$ ');

    updateWindowHeight();

    // create worker
    let builderWorker = new Worker(new URL('./build.js', import.meta.url));
    builderWorker.onmessage = function({data}) {
      // update editor
      if (data.action === 'editor') { 
        let he = hee.hetaPagesStorage.get(data.editor);
        if (data.append) {
          let currentValue = he.monacoEditor.getValue();
          he.monacoEditor.setValue(currentValue + data.value);
        } else {
          he.monacoEditor.setValue(data.value);
        }

        return; // BRAKE
      }
      // update console
      if (data.action === 'console') { 
        let he = hee.hetaPagesStorage.get('CONSOLE');
        he.appendText(data.value);

        return; // BRAKE
      }
      // show files
      if (data.action === 'finished') {
        console.log('Build finished!!!');
        return; // BRAKE
      }
      
      throw new Error(`Unknown action in worker messages: ${data.action}`);
    };

    // build button
    $('#buildBtn').on('click', async () => {
      // save all files to web file system      
      let WFS = await requestFileSystemPromise('TEMPORARY', 10*1024*1024);
      await cleanDirectoryPromise(WFS.root);
      for (let he of hmc.hetaPagesStorage.values()) {
        let text = he.monacoEditor.getValue();
        let data = new Blob([text], { type: "text/plain" });
        let entry = await getFilePromise(WFS.root, he.id, {create: true});
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

    // update editors
    window.hmc
      .hetaPagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
    window.hee
      .hetaPagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
}