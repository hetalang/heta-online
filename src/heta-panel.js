import $ from 'jquery';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
const DEFAULT_CODE = `[
    {"x": 123},
    {"y": 345}
]
`;
const DEFAULT_MODULE = {id: 'index.heta', type: 'json'};

// class storing HetaPanels
class HetaPanelContainer {
    constructor() {
        // left panel
        this.htmlLeftNavigation = $('#codeNaviLeft > div')[0];
        this.htmlLeftContainer = $('#codeContainerLeft')[0];
        
        // right panel
        this.htmlRightNavigation = $('#codeNaviRight > div')[0];
        this.htmlRightContainer = $('#codeContainerRight')[0];
    
        this.hetaModulesStorage = {};
        // set events
        let counter = 0;
        $('#addModuleBtn').on('click', () => {
            this.addModule(`index${counter++}.heta`);
        })
    }
    static createWithDefaults() {
        let hpc = new HetaPanelContainer();
        hpc.addModule('platform.json', 'json', false, true);
        hpc.addModule(DEFAULT_MODULE.id, DEFAULT_MODULE.type, false, false);

        return hpc;
    }
    addModule(id, type='HetaCode', toDelete=true, rightSide=false) {
        // add to storage
        let hp = new HetaPanel(id, toDelete, rightSide);
        hp._parent = this;
        this.hetaModulesStorage[id] = hp;
        this.showModule(id);
    }
    hideModules() {
        $('.hetaModuleBtn').removeClass('w3-bottombar w3-border-green');
        $('.hetaModuleContainer').css('display','none');
    }
    showModule(id) {
        this.hideModules();
        let panel = this.hetaModulesStorage[id];

        $(panel.htmlNavigationButton).addClass('w3-bottombar w3-border-green');
        $(panel.htmlEditorContainer).css('display', 'block');
    }
    deleteModule(id) {
        let panel = this.hetaModulesStorage[id];
        $(panel.htmlNavigationButton).remove();
        $(panel.htmlEditorContainer).remove();
        delete this.hetaModulesStorage[id];
        this.showModule(DEFAULT_MODULE.id);
    }
}

// class storing editor and visualization
class HetaPanel {
    constructor(id, toDelete=true, rightSide=false, readOnly=false) {
        this.id = id;

        // create div element
        this.htmlEditorContainer = $(`<div class="hetaModuleContainer" style="height:100%;"></div>`)
            .appendTo($('#codeContainerLeft'))[0];
        this.htmlNavigationButton = $(`<a href="#" class="hetaModuleBtn w3-bar-item w3-button"><span class="hetaModuleName">${id}</span></a>`)
            .appendTo($('#codeNaviLeft>div'))[0];
        if (rightSide) {
            $(this.htmlNavigationButton).addClass('w3-right');
        }

        // add events to module
        $(this.htmlNavigationButton).find('.hetaModuleName').on('click', () => { // 
            this._parent.showModule(id);
        });
        if (toDelete) {
            let closeBtn = $('<span class="hetaModuleCloseBtn">&nbsp; &times;</span>')
                .appendTo(this.htmlNavigationButton)
                .on('click', () => {
                    this._parent.deleteModule(id);
                });
        }

        // add editor
        this.editor = monaco.editor.create(this.htmlEditorContainer, {
            value: DEFAULT_CODE,
            language: 'json',
            readOnly: readOnly
        });
    }
}

export default HetaPanelContainer;