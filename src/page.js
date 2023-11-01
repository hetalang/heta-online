/* global $ */

// templates
import './heta-colors';
import './console-colors';
import './editor-menu';
import * as path from 'path';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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
      let ext = path.extname(file.name);
    
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
    get defaultPage() {
        return this.pagesStorage.get(this.defaultPageName);
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

// class storing editor and visualization
export class Page {
  constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
    this.id = id;
    this.name = id.split('/').pop();
    this.rightSide = rightSide;
    this.deleteBtn = deleteBtn;
    this.type = mimeType;
    //this._parent = undefined;

    // create div element
    this.editorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)[0];
    this.navigationButton = $(`<a href="#" class="hetaModuleBtn w3-button w3-small"><span class="hetaModuleName">${id}</span></a>`)[0];
    if (rightSide) {
        $(this.navigationButton).addClass('w3-right');
    }

    // add events to module
    $(this.navigationButton).on('click', () => this.show());
    if (deleteBtn) {
        $('<span class="hetaModuleCloseBtn">&nbsp; &times;</span>')
            .appendTo(this.navigationButton)
            .on('click', () => {
                let isOk = window.confirm(`"${this.id}" file will be deleted.\nAre you sure?`)
                if (isOk) {                    
                    this.delete();
                }
            });
    }
  }
  show() {
    this._parent.hideEditors();

    $(this.navigationButton).addClass('w3-bottombar w3-border-green');
    $(this.editorContainer).css('display', 'block');
    // resize
    this.monacoEditor?.layout()
  }
  delete() {
    window.localStorage.removeItem(this.id);
    $(this.navigationButton).remove();
    $(this.editorContainer).remove();
    this._parent.pagesStorage.delete(this.id);
    this._parent.defaultPage?.show();
  }
  addTo(pageCollection, setAsDefault=false) {
    // add to panel
    this._parent = pageCollection;
    if (setAsDefault) {
      pageCollection.defaultPageName = this.id;
    }
    $(pageCollection.panel).find('.codeContainer').append($(this.editorContainer));
    $(pageCollection.panel).find('.codeNavigation').append($(this.navigationButton));

    // add to storage
    pageCollection.pagesStorage.set(this.id, this);
    this.show();

    return this;
  }
  async toUint8String() {
    let ab = await this.getArrayBuffer();

    return new Uint8Array(ab).toString();
  }
}

export class EditorPage extends Page {
    constructor(id, monacoOptions={}, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
        super(id, deleteBtn, rightSide, mimeType);
        let _monacoOptions = Object.assign({}, {
          readOnly: false,
          minimap: {enabled: false},
          //automaticLayout: true
        }, monacoOptions)

        this.monacoEditor = monaco.editor.create(this.editorContainer, _monacoOptions);
        this.monacoEditor._page = this; // XXX: bad solution
    }
    delete() {
      this.monacoEditor.dispose();
      super.delete();
    }
    addTo(pageCollection, setAsDefault=false) {
      super.addTo(pageCollection, setAsDefault);
      this.monacoEditor.layout();

      return this;
    }
    fromArrayBuffer(ab) {
      let text = new TextDecoder('utf-8').decode(ab);
      this.monacoEditor.setValue(text);

      return this;
    }
    async fromFile(file) {
      let text = await file.text();
      this.type = file.type;
      this.monacoEditor.setValue(text);

      return this;
    }
    getFile() {
      let text = this.monacoEditor.getValue();
      let file = new File([text], this.id, {type: this.type});

      return file;
    }
    getArrayBuffer() {
      let text = this.monacoEditor.getValue();

      return new TextEncoder().encode(text).buffer;
    }
}

export class ConsolePage extends EditorPage {
  constructor(id) {
    super(id, {language: 'console', readOnly: true}, false, true, 'text/plain');
  }
  appendText(text) {
    let currentValue = this.monacoEditor.getValue();
    this.monacoEditor.setValue(currentValue + text);
  }
}

export class InfoPage extends Page {
  constructor(id, deleteBtn=true, rightSide=false, mimeType='application/octet-stream') {
      super(id, deleteBtn, rightSide, mimeType);
  }
  fromArrayBuffer(ab) {
    // create file
    let file = new File([ab], this.id, {type: this.type});
    this.fromFile(file);

    return this;
  }
  fromFile(file) {
    this._sourceFile = file;
    this.type = file.type;

    let url = window.URL.createObjectURL(file);
    let str = `<div class="w3-container">
      <h3>Source file info:</h3>
      <p>name: <i>${file.name}</i></p>
      <p>type: <i>${file.type}</i></p>
      <p>lastModifiedDate: <i>${file.lastModifiedDate}</i></p>
      <p>size: <i>${Math.round(file.size/1024)} Kb</i></p>
      <p><a href="${url}" download="${this.name}">DOWNLOAD</a></p>
    </div>`;
    
    $(str).appendTo(this.editorContainer);

    return this;
  }
  async getArrayBuffer() {
    return await this._sourceFile.arrayBuffer();
  }
  getFile() {
    return this._sourceFile;
  }
}