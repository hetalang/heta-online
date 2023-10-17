// templates

import DEFAULT_HETA_TEMPLATE from './heta-templates/default.heta.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
import DEFAULT_JSON_TEMPLATE from './heta-templates/default.json.template';
import DEFAULT_CSV_TEMPLATE from './heta-templates/default.csv.template';
import DEFAULT_YAML_TEMPLATE from './heta-templates/default.yaml.template';
import DEFAULT_XML_TEMPLATE from './heta-templates/default.xml.template';
import './heta-colors';
import './console-colors';
import './editor-menu';

import $ from 'jquery';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const FORMATS = { // + Exports/Modules
    json: {extension: 'json', language: 'json', template: DEFAULT_JSON_TEMPLATE}, // JSON / json
    heta: {extension: 'heta', language: 'heta', template: DEFAULT_HETA_TEMPLATE}, // HetaCode / heta
    qspUnitsHeta: {extension: 'heta', language: 'heta', template: QSP_UNITS_HETA_TEMPLATE}, // HetaCode / heta
    csv: {extension: 'csv', language: 'plaintext', template: DEFAULT_CSV_TEMPLATE}, // Table / table
    yaml: {extension: 'yml', language: 'yaml', template: DEFAULT_YAML_TEMPLATE}, // YAML / yaml
    sbml: {extension: 'xml', language: 'xml', template: DEFAULT_XML_TEMPLATE}, // SBML / sbml

    markdown: {extension: 'md', language: 'markdown'},
    mrgsolve: {extension: 'c', language: 'c'}, // Mrgsolve
    julia: {extension: 'jl', language: 'julia'}, // Julia
    matlab: {extension: 'm', language: 'plaintext'}, // Matlab
    simbio: {extension: 'm', language: 'plaintext'}, // Simbio
    dbsolve: {extension: 'slv', language: 'plaintext'}, // DBSolve
}

// class storing HetaEditors
export class PagesCollection {
    constructor(options = {}) {
        this.panel = options.panel;
        this.hetaPagesStorage = new Map();
        this.defaultPageName = undefined;
        // set events
        this.count = 0;
        options.newButton && $(options.newButton).on('change', (evt) => { 
            let format = FORMATS[evt.target.value];
            this.addUserEditor(format);
            evt.target.value = '';
        })
    }
    get defaultPage() {
        return this.hetaPagesStorage.get(this.defaultPageName);
    }
    addUserEditor(format) {
        if (format===undefined) throw new Error('Unknown Heta module format.');
        // prompt of module name
        let title = 'File name';
        let fileName = `module${this.count++}`;
        do {
            fileName = window.prompt(title, fileName);
            title = `"${fileName}.${format.extension}" already exist. Choose another name.`
        } while (this.hetaPagesStorage.has(`${fileName}.${format.extension}`))
        
        new EditorPage(`${fileName}.${format.extension}`, {value: format.template, language: format.language}, true, false)
          .addTo(this);
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
    //this._parent

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
    this._parent.defaultPage.show();
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