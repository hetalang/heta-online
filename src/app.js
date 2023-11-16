/* global $ */

// Add styles and fonts
import 'w3-css/w3.css';
//import 'font-awesome/css/font-awesome.min.css'; // font-awesome pkg, https://github.com/danklammer/bytesize-icons
import './dropping.css';

import * as path from 'path';
import JSZip from 'jszip';
import { PagesCollection } from './pages-collection';
import DnDFileController from './drug-and-drop';

import EditorPage from './editor-page';
import ConsolePage from './console-page';
//import InfoPage from './info-page';
//import VizPage from './viz-page';

// templates
import DEFAULT_HETA_TEMPLATE from './heta-templates/default.heta.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
import DEFAULT_JSON_TEMPLATE from './heta-templates/default.json.template';
import DEFAULT_CSV_TEMPLATE from './heta-templates/default.csv.template';
import DEFAULT_YAML_TEMPLATE from './heta-templates/default.yaml.template';
import DEFAULT_XML_TEMPLATE from './heta-templates/default.xml.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';
import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
const TEMPLATES = { // + Exports/Modules
  json: {extension: '.json', language: 'json', defaultValue: DEFAULT_JSON_TEMPLATE, type: 'application/json'}, // JSON / json
  heta: {extension: '.heta', language: 'heta', defaultValue: DEFAULT_HETA_TEMPLATE, type: 'text/plain'}, // HetaCode / heta
  csv: {extension: '.csv', language: 'plaintext', defaultValue: DEFAULT_CSV_TEMPLATE, type: 'text/csv'}, // Table / table
  yaml: {extension: '.yml', language: 'yaml', defaultValue: DEFAULT_YAML_TEMPLATE, type: 'application/yaml'}, // YAML / yaml
  sbml: {extension: '.xml', language: 'xml', defaultValue: DEFAULT_XML_TEMPLATE, type: 'application/sbml+xml'}, // SBML / sbml
  indexHeta: {extension: '.heta', language: 'heta', defaultValue: INDEX_HETA_TEMPLATE, defaultName: 'index.heta', type: 'text/plain'}, // HetaCode / heta
  qspUnitsHeta: {extension: '.heta', language: 'heta', defaultValue: QSP_UNITS_HETA_TEMPLATE, defaultName: 'qsp-units.heta', type: 'text/plain'}, // HetaCode / heta
};

$(window).on('resize', updateWindowHeight);

import hetaPackage from 'heta-compiler/package';

// heta modules collection
let leftCollection = new PagesCollection('#leftPanel');

// heta exports collection
let rightCollection = new PagesCollection('#rightPanel');

$(window).on('beforeunload', async function(evt) {
  evt.preventDefault();
  await saveSession();
  return null;
});

async function saveSession() {
  let leftCollectionArray = [];
  for (let page of leftCollection.pagesStorage.values()) {
    let uint8 = await page.toUint8String();
    let options = page.monacoEditor?.getRawOptions();
    leftCollectionArray.push({
      filepath: page.id,
      uint8: uint8,
      readOnly: options?.readOnly,
      rightSide: page.rightSide,
      deleteBtn: page.deleteBtn
    });
  }
  window.localStorage.setItem('leftCollectionArray', JSON.stringify(leftCollectionArray));

  let rightCollectionArray = [];
  for (let page of rightCollection.pagesStorage.values()) {
    let uint8 = await page.toUint8String();
    let options = page.monacoEditor?.getRawOptions();
    rightCollectionArray.push({
      filepath: page.id,
      uint8: uint8,
      readOnly: options?.readOnly,
      rightSide: page.rightSide,
      deleteBtn: page.deleteBtn
    });
  }
  window.localStorage.setItem('rightCollectionArray', JSON.stringify(rightCollectionArray));
}

function loadSession() {
  let leftCollectionString = localStorage.getItem('leftCollectionArray');
  let leftCollectionObject = JSON.parse(leftCollectionString);
  leftCollectionObject.forEach((x) => {
    let uint8 = new Uint8Array(x.uint8.split(','));
    leftCollection.addPageFromArrayBuffer(uint8.buffer, x.filepath, x.readOnly, x.deleteBtn, x.rightSide);
  });
  leftCollection.defaultPageName = 'platform.json';
  /*
  let rightCollectionString = localStorage.getItem('rightCollectionArray');
  let rightCollectionObject = JSON.parse(rightCollectionString);
  rightCollectionObject.forEach((x) => {
    let uint8 = new Uint8Array(x.uint8.split(','));
    rightCollection.addPageFromArrayBuffer(uint8.buffer, x.filepath, x.readOnly, x.deleteBtn, x.rightSide);
  });
  */
  rightCollection.defaultPageName = 'CONSOLE';
  new ConsolePage('CONSOLE')
    .addTo(rightCollection, true)
    .appendText('$ ');
}

function loadDefaultPages() {
  new EditorPage('platform.json', {value: PLATFORM_JSON_TEMPLATE, language: 'json'}, true, true)
    .addTo(leftCollection, true); // default page
  new EditorPage('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, true, false)
    .addTo(leftCollection, false);

  new ConsolePage('CONSOLE')
    .addTo(rightCollection, true)
    .appendText('$ heta init -s\nCreating a template platform in directory: "/"...\nPlatform template is created in silent mode.\nDONE.\n\n$ ');
}

// document ready
$(async () => {
    if (localStorage.length===0) {
      loadDefaultPages();
    } else {
      loadSession();
    }

    updateWindowHeight();

    // set button events
    $('#hc-version').text(hetaPackage.version);
    $('#hc-github').attr('href', 'https://github.com/hetalang/heta-online/'); // hetaPackage.repository.url
    //$('#hc-homepage').attr('href', 'https://hetalang.github.io/#/'); // hetaPackage.homepage
    $('#hc-info').on('click', () => $('#modalDiv').show());
    $('#hc-clean').on('click', () => {
      let isOk = window.confirm('You are about to reset the platform to the initial state and delete all progress. Are you sure?');
      if (isOk) {
        // delete pages
        for (let page of leftCollection.pagesStorage.values()) {
          page.delete();
        }
        for (let page of rightCollection.pagesStorage.values()) {
          page.delete();
        }
        localStorage.clear();
        // set default values
        loadDefaultPages();
      }
    });
    $('#hc-download').on('click', () => downloadPlatform());

    // Drag and Drop
    new DnDFileController(async (files) => {
      for (let file of files) {
        await leftCollection.addPageFromFile(file);
      }
    });

    // add file or template to left panel
    let checker = new NameChecker(); 
    $('#newButton').on('change', (evt) => {
      let value = evt.target.value;
      evt.target.value = '';
      if (value==='loadFiles') { // from file
        $('<input type="file" accept=".yml,.yaml,.json,.xml,.heta,.txt,.csv,.xlsx,.xls,.sbml" multiple=true/>')
          .on('change', async (evt) => {
            for (let file of $(evt.target)[0].files) {
              await leftCollection.addPageFromFile(file);
            }
          })
          .click();
      } else { // from template
        let format = TEMPLATES[value];
        let filepath = checker.checkName(format.defaultName, format.extension);
        if (!filepath) return; // BRAKE
        new EditorPage(filepath, {value: format.defaultValue, language: format.language}, true, false)
          .addTo(leftCollection);
      }
    });
    
    // create Worker
    let builderWorker = new Worker(new URL('./build.js', import.meta.url));
    builderWorker.onmessage = async function({data}) {
      // update editor {action: 'editor', value: 'Some message', append: true} NOT USED
      if (data.action === 'editor') { 
        let he = rightCollection.pagesStorage.get(data.editor);
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
        rightCollection.pagesStorage.get('CONSOLE').appendText(data.value);

        return; // BRAKE
      }

      // show files {action: 'finished/stop', dict: {...}}
      if (data.action === 'finished' || data.action === 'stop') {
        Object.getOwnPropertyNames(data.dict).forEach((name) => {
          rightCollection.addPageFromArrayBuffer(data.dict[name], name); // ArrayBuffer
        });

        return; // BRAKE
      }
      
      throw new Error(`Unknown action in worker messages: ${data.action}`);
    };

    // build button
    $('#buildBtn').removeClass('w3-disabled'); // to turn it on
    $('#buildBtn').on('click', async () => {
      // clean old exports
      for (let [filepath, page] of rightCollection.pagesStorage) {
        filepath!==rightCollection.defaultPageName && page.delete();
      }

      // save all as object {filepath1: buffer1, filepath2: buffer2, ...}
      let fileDict = {};
      for (let [filepath, page] of leftCollection.pagesStorage) {
        fileDict['/' + filepath] = await page.getArrayBuffer(); // ArrayBuffer
      }

      // run builder
      builderWorker.postMessage({
        files: fileDict
      });
    });
});

async function downloadPlatform() {
  const zip = new JSZip();

  [...leftCollection.pagesStorage].map(([filepath, page]) => {
    let ab = page.getArrayBuffer();
    let filenameRelative = path.relative('/', filepath);
    zip.file(filenameRelative, ab, {binary: false});
  });
  [...rightCollection.pagesStorage].map(([filepath, page]) => {
    let ab = page.getArrayBuffer();
    let filenameRelative = path.relative('/', filepath);
    zip.file(filenameRelative, ab, {binary: false});
  });

  let blob = await zip.generateAsync({type: 'blob'});

  let url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'platform.zip';
  a.click();
}

function updateWindowHeight(){
    let h = document.documentElement.clientHeight - $('#topDiv').outerHeight();
    $('#mainDiv').height(h + 'px');

    let h2 = $('#mainDiv').outerHeight() - $('#leftPanel .codeNavigation').outerHeight() - 2;
    $('#leftPanel .codeContainer').height(h2 + 'px');

    let h3 = $('#mainDiv').outerHeight() - $('#rightPanel .codeNavigation').outerHeight() - 2;
    $('#rightPanel .codeContainer').height(h3 + 'px');

    // update editors
    leftCollection.pagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
    rightCollection.pagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
}

function NameChecker() {
  let counter = 0;

  this.checkName = function checkName(defaultName, extension) {
    // prompt for module name
    let fileName = defaultName || `module${counter++}${extension}`;
    for (let repeat = true, title = 'File name'; repeat;) {
      fileName = window.prompt(title, fileName);
      if (fileName===null) {
        repeat = false;
      } else if (leftCollection.pagesStorage.has(fileName)) {
        title = `"${fileName}" already exist. Choose another name.`;
      } else if (path.extname(fileName)!==extension) {
        title = `"${fileName}" has wrong extension "${path.extname(fileName)}".`;
      } else {
        repeat = false;
      }
    }
  
    return fileName;
  }
}
