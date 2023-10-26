/* global $ */

// Add styles and fonts
import 'w3-css/w3.css';
import 'font-awesome/css/font-awesome.min.css';
import './dropping.css';

import * as path from 'path';
import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';

import { PagesCollection, EditorPage, ConsolePage, InfoPage } from './page';
import DnDFileController from './drug-and-drop';

$(window).on('resize', updateWindowHeight);

import hetaPackage from 'heta-compiler/package';

// document ready
$(async () => {
    // heta modules collection
    let leftCollection = window.leftCollection = new PagesCollection('#leftPanel', '#newButton');

    // heta exports collection
    let rightCollection = window.rightCollection = new PagesCollection('#rightPanel');

    function createDefaultPages() {
      new EditorPage('platform.json', {value: PLATFORM_JSON_TEMPLATE, language: 'json'}, false, true)
        .addTo(leftCollection,true); // default page
      new EditorPage('index.heta', {value: INDEX_HETA_TEMPLATE, language: 'heta'}, true, false)
        .addTo(leftCollection, false);

      new ConsolePage('CONSOLE')
        .addTo(rightCollection, true)
        .appendText('$ ');
    }
    createDefaultPages();

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
        for (let page of leftCollection.hetaPagesStorage.values()) {
          page.delete();
        }
        for (let page of rightCollection.hetaPagesStorage.values()) {
          page.delete();
        }
        // set default values
        createDefaultPages();
      }
    });

    // Drag and Drop
    new DnDFileController('body', async (file) => {
      await leftCollection.addPageFromFile(file, file.name, true);
    });
    
    // create Worker
    let builderWorker = new Worker(new URL('./build.js', import.meta.url));
    builderWorker.onmessage = async function({data}) {
      // update editor {action: 'editor', value: 'Some message', append: true}
      if (data.action === 'editor') { 
        let he = rightCollection.hetaPagesStorage.get(data.editor);
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
        rightCollection.hetaPagesStorage.get('CONSOLE').appendText(data.value);

        return; // BRAKE
      }

      // show files {action: 'finished/stop', dict: {...}}
      if (data.action === 'finished' || data.action === 'stop') {
        Object.getOwnPropertyNames(data.dict).forEach((name) => {
          let filename = path.parse(name).base;
          let file = new File([data.dict[name]], filename); // 
          rightCollection.addPageFromFile(file, name, false);
        });

        return; // BRAKE
      }
      
      throw new Error(`Unknown action in worker messages: ${data.action}`);
    };

    // build button
    $('#buildBtn').removeClass('w3-disabled'); // to turn it on
    $('#buildBtn').on('click', async () => {
      // clean old exports
      for (let [filepath, page] of rightCollection.hetaPagesStorage) {
        filepath!==rightCollection.defaultPageName && page.delete();
      }

      // save all as object {filepath1: buffer1, filepath2: buffer2, ...}
      let fileDict = {};
      for (let [filepath, page] of leftCollection.hetaPagesStorage) {
        fileDict['/' + filepath] = await page.getBuffer();
      }

      // run builder
      builderWorker.postMessage({
        files: fileDict
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
    window.leftCollection
      .hetaPagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
    window.rightCollection
      .hetaPagesStorage
      .forEach((x) => $(x.editorContainer).css('display') === 'block' && x.monacoEditor?.layout());
}