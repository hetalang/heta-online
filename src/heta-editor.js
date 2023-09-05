// templates

import DEFAULT_HETA_TEMPLATE from './heta-templates/default.heta.template';
import DEFAULT_JSON_TEMPLATE from './heta-templates/default.json.template';
import DEFAULT_CSV_TEMPLATE from './heta-templates/default.csv.template';
import DEFAULT_YAML_TEMPLATE from './heta-templates/default.yaml.template';
import DEFAULT_XML_TEMPLATE from './heta-templates/default.xml.template';

import $ from 'jquery';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const FORMATS = {
    json: {fileType: 'json', template: DEFAULT_JSON_TEMPLATE},
    heta: {fileType: 'heta', template: DEFAULT_HETA_TEMPLATE},
    csv: {fileType: 'csv', template: DEFAULT_CSV_TEMPLATE},
    yaml: {fileType: 'yaml', template: DEFAULT_YAML_TEMPLATE},
    xml: {fileType: 'xml', template: DEFAULT_XML_TEMPLATE},
}

// class storing HetaEditors
class HetaEditorsCollection {
    constructor(options = {}) {
        this.panel = options.panel;
        this.hetaEditorsStorage = new Map();
        this.defaultEditorName = options.defaultEditor; // TODO: bad solution
        // set events
        this.count = 0;
        options.newButton && $(options.newButton).on('change', (evt) => { 
            let format = FORMATS[evt.target.value];
            this.addUserEditor(format);
            evt.target.value = '';
        })
    }
    get defaultEditor() {
        return this.hetaEditorsStorage.get(this.defaultEditorName);
    }
    addUserEditor(format) {
        if (format===undefined) throw new Error('Unknown Heta module format.');
        // prompt of module name
        let title = 'File name';
        let fileName = `module${this.count++}`;
        do {
            fileName = window.prompt(title, fileName);
            title = `"${fileName}.${format.fileType}" already exist. Choose another name.`
        
        } while (this.hetaEditorsStorage.has(`${fileName}.${format.fileType}`))
        
        this.addEditor(`${fileName}.${format.fileType}`, format.template, format.fileType);
    }
    addEditor(id, initialCode, type, toDelete=true, rightSide=false) {
        // add to storage
        let hp = new HetaEditor(this, id, initialCode, type, toDelete, rightSide);
        this.hetaEditorsStorage.set(id, hp);
        hp.show();
    }
    hideEditors() {
        $(this.panel).find('.hetaModuleBtn').removeClass('w3-bottombar w3-border-green');
        $(this.panel).find('.hetaModuleContainer').css('display','none');
    }
}

// class storing editor and visualization
class HetaEditor {
    constructor(parent, id, initialCode, type='json', toDelete=true, rightSide=false, readOnly=false) {
        this.id = id;
        this._parent = parent;

        // create div element
        this.editorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)
            .appendTo($(this._parent.panel).find('.codeContainer'))[0];
        this.navigationButton = $(`<a href="#" class="hetaModuleBtn w3-button w3-small"><span class="hetaModuleName">${id}</span></a>`)
            .appendTo($(this._parent.panel).find('.codeNavigation'))[0];
        if (rightSide) {
            $(this.navigationButton).addClass('w3-right');
        }

        // add events to module
        $(this.navigationButton).find('.hetaModuleName').on('click', () => this.show());
        if (toDelete) {
            $('<span class="hetaModuleCloseBtn">&nbsp; &times;</span>')
                .appendTo(this.navigationButton)
                .on('click', () => {
                    let isOk = window.confirm(`"${this.id}" file will be deleted.\nAre you sure?`)
                    if (isOk) {                    
                        this.delete();
                    }
                });
        }

        // add editor
        this.monacoEditor = monaco.editor.create(this.editorContainer, {
            value: initialCode,
            language: type ,
            readOnly: readOnly
        });
    }
    show() {
        this._parent.hideEditors();

        $(this.navigationButton).addClass('w3-bottombar w3-border-green');
        $(this.editorContainer).css('display', 'block');
    }
    delete() {
        $(this.navigationButton).remove();
        $(this.editorContainer).remove();
        this._parent.hetaEditorsStorage.delete(this.id);
        this._parent.defaultEditor.show();
    }
}

export default HetaEditorsCollection;