import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
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
import * as prom from './promises'

const extensions = {
  'heta': {lang: 'heta'},
  'm': {lang: 'matlab'},
  'xml': {lang: 'xml'},
  'json': {lang: 'json'},
  'yml': {lang: 'yaml'},
  'slv': {lang: 'cpp'},
  'r': {lang: 'r'},
  //'xlsx': {lang: 'text'},
  'cpp': {lang: 'cpp'},
  'c': {lang: 'c'},
  'jl': {lang: 'julia'},
  html: {lang: 'html'},
  md: {lang: 'markdown'},
};

// document ready
$(async () => {
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
      .addTo(hmc,true); // default page
    new EditorPage('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, true, false)
      .addTo(hmc, false);

    // heta exports collection
    let hee = window.hee = new PagesCollection({
      panel: '#rightPanel'
    });

    new ConsolePage('CONSOLE')
      .addTo(hee, true)
      .appendText('$ ');

    updateWindowHeight();

    // create file system
    let WFS = await prom.requestFileSystemPromise('TEMPORARY', 10*1024*1024);
    
    // create worker
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
          let logsEntry = await prom.getFilePromise(WFS.root, data.logPath, {create: false});
          let file = await prom.filePromise(logsEntry);
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
        let distEntry = await prom.getDirectoryPromise(WFS.root, data.dist, {create: false});
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
    $('#buildBtn').on('click', async () => {
      // save all files to web file system      
      await prom.cleanDirectoryPromise(WFS.root);
      for (let he of hmc.hetaPagesStorage.values()) {
        let text = he.monacoEditor.getValue();
        let data = new Blob([text], { type: "text/plain" });
        let entry = await prom.getFilePromise(WFS.root, he.id, {create: true});
        let writer = await prom.createWriterPromise(entry);
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
    // get extension
    let ext = entry.fullPath.split('.').pop();
    let lang = extensions[ext]?.lang || 'plaintext';
    if (!lang) throw new Error(`Unknown extension: ${ext}`);

    // get content
    let file = await prom.filePromise(entry);
    let text = await file.text();

    new EditorPage(entry.fullPath, {language: lang, value: text, readOnly: true})
      .addTo(hee);
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