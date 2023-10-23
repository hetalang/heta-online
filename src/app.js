/* global $ */

// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';
import './dropping.css';

import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';

import { PagesCollection, EditorPage, ConsolePage, InfoPage } from './page';
import DnDFileController from './drug-and-drop';

$(window).on('resize', updateWindowHeight);

import hetaPackage from 'heta-compiler/package';
import * as prom from './promises'

// document ready
$(async () => {
    $('#hc-version').text(hetaPackage.version);
    $('#hc-github').attr('href', 'https://github.com/hetalang/heta-online/'); // hetaPackage.repository.url
    //$('#hc-homepage').attr('href', 'https://hetalang.github.io/#/'); // hetaPackage.homepage
    $('#hc-info').on('click', () => $('#modalDiv').show());

    // heta modules collection
    let hmc = window.hmc = new PagesCollection('#leftPanel', '#newButton');

    new EditorPage('platform.json', {value: PLATFORM_JSON_TEMPLATE, language: 'json'}, false, true)
      .addTo(hmc,true); // default page
    new EditorPage('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, true, false)
      .addTo(hmc, false);

    // heta exports collection
    let hee = window.hee = new PagesCollection('#rightPanel');

    new ConsolePage('CONSOLE')
      .addTo(hee, true)
      .appendText('$ ');

    updateWindowHeight();

    // check browser support
    if (!window.webkitRequestFileSystem && !window.requestFileSystem) {
      $('#errMessage').text('Unsupported browser. This will be fixed in future releases.');
      $('#modalDiv').show();
      return; // BRAKE
    }

    // create file system
    let WFS = await prom.requestFileSystemPromise('TEMPORARY', 10*1024*1024);

    // Drag and Drop
    new DnDFileController('body', async (file) => {
      await hmc.addPageFromFile(file, file.name, true);
    });
    
    // create Worker
    let builderWorker = new Worker(new URL('./build.js', import.meta.url));
    builderWorker.onmessage = async function({data}) {
      // update editor {action: 'editor', value: 'Some message', append: true}
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

      // update console {action: 'console', value: 'Some message'}
      if (data.action === 'console') { 
        hee.hetaPagesStorage.get('CONSOLE').appendText(data.value);

        return; // BRAKE
      }

      // display /output.logs
      if (data.action === 'finished' || data.action === 'stop') {
        try {
          let logsEntry = await prom.getFilePromise.bind(WFS.root)(data.logPath, {create: false});
          let file = await prom.filePromise.bind(logsEntry)();
          let text = await file.text();

          new EditorPage(logsEntry.fullPath, {language: 'plaintext', value: text, readOnly: true})
            .addTo(hee);
        } catch(e) {
          if (!(e instanceof DOMException))
          throw e;
        }
      }

      // show files {action: 'finished', dist: 'dist'}
      if (data.action === 'finished') {
        let distEntry = await prom.getDirectoryPromise.bind(WFS.root)(data.dist, {create: false});
        let entries = await getFileEntriesDeep(distEntry);
        displayDistFiles(entries, hee);
        return; // BRAKE
      }

      if (data.action === 'stop') {
        return;
      }
      
      throw new Error(`Unknown action in worker messages: ${data.action}`);
    };

    // build button
    $('#buildBtn').removeClass('w3-disabled'); // to turn it on
    $('#buildBtn').on('click', async () => {
      // save all files to web file system      
      await prom.cleanDirectoryPromise.bind(WFS.root)();
      for (let he of hmc.hetaPagesStorage.values()) {
        let data = he.getContent();
        let entry = await prom.getFilePromise.bind(WFS.root)(he.id, {create: true});
        let writer = await prom.createWriterPromise.bind(entry)();
        writer.write(data);
      }

      // clean old exports
      for (let page of hee.hetaPagesStorage.values()) {
        page.id!==hee.defaultPageName && page.delete();
      }

      // run builder
      builderWorker.postMessage({
        url: WFS.root.toURL()
      });
    });
});

async function getFileEntriesDeep(directoryEntry) {
  let _entries = await prom.readEntriesPromise(directoryEntry.createReader());
  let fileEntries = _entries.reduce(async (accumulator, currentValue) => {
    if (currentValue.isFile) {
      var deepFileEntries = [currentValue];
    } else {
      deepFileEntries = await getFileEntriesDeep(currentValue);
    }
    return (await accumulator).concat(deepFileEntries)
    
  }, Promise.resolve([]));

  return fileEntries;
} 

async function displayDistFiles(entries, hee) {
  for (let entry of entries) {
    let file = await prom.filePromise.bind(entry)();
    hee.addPageFromFile(file, entry.fullPath, false);
  }

  //console.log(entries); // XXX: TESTING
}

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