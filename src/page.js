/* global $ */

// templates
import DEFAULT_HETA_TEMPLATE from './heta-templates/default.heta.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
import DEFAULT_JSON_TEMPLATE from './heta-templates/default.json.template';
import DEFAULT_CSV_TEMPLATE from './heta-templates/default.csv.template';
import DEFAULT_YAML_TEMPLATE from './heta-templates/default.yaml.template';
import DEFAULT_XML_TEMPLATE from './heta-templates/default.xml.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';
import './heta-colors';
import './console-colors';
import './editor-menu';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const FORMATS = { // + Exports/Modules
    json: {extension: 'json', language: 'json', defaultValue: DEFAULT_JSON_TEMPLATE}, // JSON / json
    heta: {extension: 'heta', language: 'heta', defaultValue: DEFAULT_HETA_TEMPLATE}, // HetaCode / heta
    csv: {extension: 'csv', language: 'plaintext', defaultValue: DEFAULT_CSV_TEMPLATE}, // Table / table
    yaml: {extension: 'yml', language: 'yaml', defaultValue: DEFAULT_YAML_TEMPLATE}, // YAML / yaml
    sbml: {extension: 'xml', language: 'xml', defaultValue: DEFAULT_XML_TEMPLATE}, // SBML / sbml
    indexHeta: {extension: 'heta', language: 'heta', defaultValue: INDEX_HETA_TEMPLATE, defaultName: 'index.heta'}, // HetaCode / heta
    qspUnitsHeta: {extension: 'heta', language: 'heta', defaultValue: QSP_UNITS_HETA_TEMPLATE, defaultName: 'qsp-units.heta'}, // HetaCode / heta
    xlsx: {extension: 'xlsx', pageType: 'info'},

    slv: {extension: 'slv', pageType: 'info'},
    txt: {extension: 'txt', language: 'plaintext'},
    markdown: {extension: 'md', language: 'markdown'}, // Markdown
    mrgsolve: {extension: 'c', language: 'c'}, // Mrgsolve
    julia: {extension: 'jl', language: 'julia'}, // Julia
    matlab: {extension: 'm', language: 'plaintext'}, // Matlab
    simbio: {extension: 'm', language: 'plaintext'}, // Simbio
    dbsolve: {extension: 'slv', language: 'plaintext'}, // DBSolve
    cpp: {extension: 'cpp', language: 'cpp'}, // C++
    r: {extension: 'r', language: 'r'}, // R
    c: {extension: 'c', language: 'c'}, // C
    html: {extension: 'html', language: 'html'}, // HTML
    log: {extension: 'log', language: 'plaintext'}, 
};

// class storing HetaEditors
export class PagesCollection {
    constructor(panel, newButton) {
        this.panel = panel;
        this.hetaPagesStorage = new Map();
        this.defaultPageName = undefined;
        // set events
        this.count = 0;
        newButton && $(newButton).on('change', (evt) => {
          if (evt.target.value==='loadFile') { // from file
            $('<input type="file" accept=".yml,.yaml,.json,.xml,.heta,.txt,.csv,.xlsx" multiple=false/>')
              .on('change', (evt) => this.addPageFromFile($(evt.target)[0].files[0]))
              .click();
          } else { // from template
            let format = FORMATS[evt.target.value];
            this.addPage(format);
          }
          evt.target.value = '';
        });
    }

    // add page based on file
    async addPageFromFile(file, filepath=file.name, usePrompt=true) {
      let ext = file.name.split('.').pop();
    
      let subFormatName = Object.getOwnPropertyNames(FORMATS)
        .find((x) => FORMATS[x].extension === ext);
      if (!subFormatName) {
        window.alert(`Unsupported file extension: ${ext}`);
        return; // BRAKE
      }
      
      let format = FORMATS[subFormatName];
      let page = this.addPage({
        extension: format.extension,
        pageType: format.pageType,
        language: format.language,
        defaultName: filepath,
      }, usePrompt);
      await page.setContent(file);

      return page;
    }

    get defaultPage() {
        return this.hetaPagesStorage.get(this.defaultPageName);
    }

    // add page based on options
    addPage(format, usePrompt=true) {
        let fileName = usePrompt ? this.checkPageName(format) : format.defaultName
        
        if (!!fileName && format.pageType==='info') {
          var page = new InfoPage(fileName, true, false)
            .addTo(this);
        } else if (!!fileName) {        
          page = new EditorPage(fileName, {value: format.defaultValue, language: format.language}, true, false)
            .addTo(this);
        }

        return page;
    }
    checkPageName(format) {
      // prompt for module name
      let fileName = format.defaultName || `module${this.count++}.${format.extension}`;
      let title = 'File name';
      do {
          fileName = window.prompt(title, fileName);
          title = `"${fileName}" already exist. Choose another name.`
      } while (this.hetaPagesStorage.has(fileName))

      return fileName;
    }
    hideEditors() {
        $(this.panel).find('.hetaModuleBtn').removeClass('w3-bottombar w3-border-green');
        $(this.panel).find('.hetaModuleContainer').css('display','none');
    }
}

// class storing editor and visualization
export class Page {
  constructor(id, deleteBtn=true, rightSide=false) {
    this.id = id;
    this.name = id.split('/').pop();
    //this._parent = undefined;

    // create div element
    this.editorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)[0];
    this.navigationButton = $(`<a href="#" class="hetaModuleBtn w3-button w3-small"><span class="hetaModuleName">${id}</span></a>`)[0];
    if (rightSide) {
        $(this.navigationButton).addClass('w3-right');
    }

    // add events to module
    $(this.navigationButton).find('.hetaModuleName').on('click', () => this.show());
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
    $(this.navigationButton).remove();
    $(this.editorContainer).remove();
    this._parent.hetaPagesStorage.delete(this.id);
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
    pageCollection.hetaPagesStorage.set(this.id, this);
    this.show();

    return this;
  }
  getBuffer() {
    throw new Error('getBuffer method is not implemented for Page class.');
  }
}

export class EditorPage extends Page {
    constructor(id, monacoOptions={}, deleteBtn=true, rightSide=false) {
        super(id, deleteBtn, rightSide);
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
    async setContent(file) {
      let text = await file.text();
      this.monacoEditor.setValue(text);

      return this;
    }
    getFile() {
      let text = this.monacoEditor.getValue();
      let file = new File([text], this.id, {type: 'text/plain;charset=UTF-8'});

      return file;
    }
    getBuffer() {
      let text = this.monacoEditor.getValue();
      let buffer = Buffer.from(text, 'utf-8');

      return buffer;
    }
}

export class ConsolePage extends EditorPage {
  constructor(id) {
    super(id, {language: 'console', readOnly: true}, false, true);
  }
  appendText(text) {
    let currentValue = this.monacoEditor.getValue();
    this.monacoEditor.setValue(currentValue + text);
  }
}

export class InfoPage extends Page {
  constructor(id, deleteBtn=true, rightSide=false) {
      super(id, deleteBtn, rightSide);
  }
  async setContent(file) {
    this._sourceFile = file;

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
  async getBuffer() {
    let buffer = await this._sourceFile.arrayBuffer();

    return buffer;
  }
  getFile() {
    return this._sourceFile;
  }
}