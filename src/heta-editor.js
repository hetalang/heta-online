// templates
import PLATFORM_JSON_TEMPLATE from './heta-templates/platform.json.template';
import INDEX_HETA_TEMPLATE from './heta-templates/index.heta.template';
import QSP_UNITS_HETA_TEMPLATE from './heta-templates/qsp-units.heta.template';
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
    constructor() {
        // left panel
        this.leftNavigationPanel = $('#codeNaviLeft')[0];
        this.leftCodePanel = $('#codeContainerLeft')[0];
        
        // right panel
        this.rightNavigationPanel = $('#codeNaviRight')[0];
        this.rightCodePanel = $('#codeContainerRight')[0];
    
        this.hetaEditorsStorage = new Map();
        // set events
        let counter = 0;
        $('#newButton').on('change', (evt) => {
            let format = FORMATS[evt.target.value];
            if (format==undefined) throw new Error('Unknown Heta module format.');
            this.addEditor(`module${counter++}.${format.fileType}`, format.template, format.fileType);
            evt.target.value = '';
        })
    }
    static createWithDefaults() {
        let hpc = new HetaEditorsCollection();
        hpc.addEditor('platform.json', PLATFORM_JSON_TEMPLATE, 'json', false, true);
        hpc.addEditor('qsp-units.heta', QSP_UNITS_HETA_TEMPLATE, 'json');
        hpc.addEditor('index.heta', INDEX_HETA_TEMPLATE, 'heta', false, false);

        return hpc;
    }
    addEditor(id, initialCode=DEFAULT_HETA_TEMPLATE, type='HetaCode', toDelete=true, rightSide=false) {
        // add to storage
        let hp = new HetaEditor(id, initialCode, type, toDelete, rightSide);
        hp._parent = this;
        this.hetaEditorsStorage.set(id, hp);
        this.showEditor(id);
    }
    hideEditors() {
        $('.hetaModuleBtn').removeClass('w3-bottombar w3-border-green');
        $('.hetaModuleContainer').css('display','none');
    }
    showEditor(id) {
        this.hideEditors();
        let panel = this.hetaEditorsStorage.get(id);

        $(panel.navigationButton).addClass('w3-bottombar w3-border-green');
        $(panel.editorContainer).css('display', 'block');
    }
    deleteEditor(id) {
        let panel = this.hetaEditorsStorage.get(id);
        $(panel.navigationButton).remove();
        $(panel.editorContainer).remove();
        this.hetaEditorsStorage.delete(id);
        this.showEditor('index.heta');
    }
}

// class storing editor and visualization
class HetaEditor {
    constructor(id, initialCode, type='json', toDelete=true, rightSide=false, readOnly=false) {
        this.id = id;

        // create div element
        this.editorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)
            .appendTo($('#codeContainerLeft'))[0];
        this.navigationButton = $(`<a href="#" class="hetaModuleBtn w3-button w3-small"><span class="hetaModuleName">${id}</span></a>`)
            .appendTo($('#codeNaviLeft'))[0];
        if (rightSide) {
            $(this.navigationButton).addClass('w3-right');
        }

        // add events to module
        $(this.navigationButton).find('.hetaModuleName').on('click', () => {
            this._parent.showEditor(id);
        });
        if (toDelete) {
            $('<span class="hetaModuleCloseBtn">&nbsp; &times;</span>')
                .appendTo(this.navigationButton)
                .on('click', () => {
                    this._parent.deleteEditor(id);
                });
        }

        // add editor
        this.monacoEditor = monaco.editor.create(this.editorContainer, {
            value: initialCode,
            language: type ,
            readOnly: readOnly
        });
    }
}

export default HetaEditorsCollection;