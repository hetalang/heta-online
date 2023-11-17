/* global $ */

// templates
import './heta-colors';
import './console-colors';
import './editor-menu';
import * as path from 'path';

import EditorPage from './editor-page';
//import ConsolePage from './console-page';
import InfoPage from './info-page';
import VizPage from './viz-page';

const FORMATS = { // + Exports/Modules
    json: {extension: '.json', language: 'json', type: 'application/json'}, // JSON / json
    heta: {extension: '.heta', language: 'heta'}, type: 'text/plain', // HetaCode / heta
    csv: {extension: '.csv', language: 'plaintext', type: 'text/csv'}, // Table / table
    yaml: {extension: '.yml', language: 'yaml', type: 'application/yaml'}, // YAML / yaml
    sbml: {extension: '.xml', language: 'xml', type: 'application/sbml+xml'}, // SBML / sbml
    
    xlsx: {extension: '.xlsx', pageType: 'info', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
    slv: {extension: '.slv', pageType: 'info', type: 'application/octet-stream'},
    txt: {extension: '.txt', language: 'plaintext', type: 'text/plain'},
    markdown: {extension: '.md', language: 'markdown', type: 'text/markdown'}, // Markdown
    mrgsolve: {extension: '.c', language: 'c', type: 'text/plain'}, // Mrgsolve
    julia: {extension: '.jl', language: 'julia', type: 'text/plain'}, // Julia
    matlab: {extension: '.m', language: 'plaintext', type: 'text/plain'}, // Matlab
    simbio: {extension: '.m', language: 'plaintext', type: 'text/plain'}, // Simbio
    dbsolve: {extension: '.slv', language: 'plaintext', type: 'application/octet-stream'}, // DBSolve
    cpp: {extension: '.cpp', language: 'cpp', type: 'text/plain'}, // C++
    r: {extension: '.r', language: 'r', type: 'text/plain'}, // R
    c: {extension: '.c', language: 'c', type: 'text/plain'}, // C
    html: {extension: '.html', language: 'html', type: 'text/html'}, // HTML
    log: {extension: '.log', language: 'plaintext', type: 'text/plain'},

    dot: {extension: '.dot', pageType: 'Viz', language: 'dot', type: 'text/plain'},
    xls: {extension: '.xls', pageType: 'info', type: 'application/vnd.ms-excel'},
};

// class storing HetaEditors
export class PagesCollection {
    constructor(panel) {
        this.panel = panel;
        this.pagesStorage = new Map();
        this.defaultPageName = undefined;
    }
    // for loading user files
    async addPageFromFile(file) {
      let {ext, name} = path.parse(file.name);
    
      let formatName = Object.getOwnPropertyNames(FORMATS)
        .find((x) => FORMATS[x].extension === ext);
      if (!formatName) {
        window.alert(`Unsupported file extension: ${ext}`);
        return; // BRAKE
      }
      
      let format = FORMATS[formatName];
      let filepath = this.checkPageName(file.name, format.extension);
      if (!filepath) return; // BRAKE
      if (format.pageType==='info') {
        var page = new InfoPage(filepath, true, false, format.type)
            .addTo(this);
      } else if (name === 'platform' && ['.json', '.json5', 'yml'].indexOf(ext) ) {
        page = new EditorPage(filepath, {language: format.language}, true, true, format.type)
          .addTo(this);
      } else {
        page = new EditorPage(filepath, {language: format.language}, true, false, format.type)
          .addTo(this);
      }
      await page.fromFile(file);

      return page;
    }
    // for loading dist and session files
    async addPageFromArrayBuffer(ab, filepath, readOnly=true, deleteBtn=true, rightSide=false) {
      let ext = path.extname(filepath);

      let formatName = Object.getOwnPropertyNames(FORMATS)
        .find((x) => FORMATS[x].extension === ext);
      if (!formatName) {
        window.alert(`Unsupported file extension: ${ext}`);
        return; // BRAKE
      }
      let format = FORMATS[formatName];
      if (format.pageType==='info') {
        var page = new InfoPage(filepath, deleteBtn, rightSide, format.type)
            .addTo(this);
      } else {
        page = new EditorPage(filepath, {language: format.language, readOnly: readOnly}, deleteBtn, rightSide, format.type)
          .addTo(this);
      }

      page.fromArrayBuffer(ab);

      return page;
    }
    get nextPage() { // get the page to display next
      return [...this.pagesStorage.values()].pop(); // return the last page in the Map
    }
    checkPageName(initialFileName, extension) {
      // prompt for module name
      let fileName = initialFileName;

      for (let title = 'File name';;) {
        fileName = window.prompt(title, fileName);
        if (fileName===null) {
          break;
        } else if (this.pagesStorage.has(fileName)) {
          title = `"${fileName}" already exist. Choose another name.`;
        } else if (path.extname(fileName)!==extension) {
          title = `"${fileName}" has wrong extension "${path.extname(fileName)}".`;
        } else {
          break;
        }
      }

      return fileName;
    }
    hideEditors() {
        $(this.panel).find('.hetaModuleBtn').removeClass('w3-bottombar w3-border-green');
        $(this.panel).find('.hetaModuleContainer').css('display','none');
    }
}
