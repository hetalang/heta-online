// templates

import DEFAULT_HETA_TEMPLATE from './heta-templates/default.heta.template';
import DEFAULT_JSON_TEMPLATE from './heta-templates/default.json.template';
import DEFAULT_CSV_TEMPLATE from './heta-templates/default.csv.template';
import DEFAULT_YAML_TEMPLATE from './heta-templates/default.yaml.template';
import DEFAULT_XML_TEMPLATE from './heta-templates/default.xml.template';

import $ from 'jquery';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.languages.register({id: 'heta'});
monaco.languages.setMonarchTokensProvider('heta', {
  defaultToken: 'invalid',
    keywords: ['include', 'type', 'with', 'namespace', 'begin', 'end', 'true', 'false', 'Inf', 'NaN'],
    //tokenPostfix: ".yaml",
  brackets: [
    { token: "delimiter.bracket", open: "{", close: "}" },
    { token: "delimiter.square", open: "[", close: "]" },
    { token: 'comment', open: '/*', close: '*/' }
  ],
  ws: /[ \t\r\n]/,
  numberInteger: /(?:0|[+-]?[0-9]+)/,
  numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:[eE][-+][1-9][0-9]*)?/,
  numberInfinity: /[+-]?Infinity/,
  numberNaN: /NaN/,
  mathExpr: /[\w\s*\+\-\*\/\^\(\)\.\>\<\=\!\?\,]+/,
  escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
  idProp: /[a-zA-Z]+\w*/,
  actionProp: /#[a-zA-Z]+\w*/,
  classProp: /\@[a-zA-Z]+\w*/,
  filepathFormat: /[\w\/\\\.\-]+/,
  tokenizer: {
    root: [
      { include: "@comment" },
      { include: '@multilineCommentStart' },
      { include: "@whitespace" },
      [/(?=include )/, 'keyword', '@includeStatement'],
      [/(?=namespace )/, 'keyword', 'namespaceBlock'],
      { include: "@actionStatement" },
      //[/@numberInteger(?![ \t]*\S+)/, "number"],
      //[/@numberFloat(?![ \t]*\S+)/, "number.float"],
      //[/@numberInfinity(?![ \t]*\S+)/, "number.infinity"],
      //[/@numberNaN(?![ \t]*\S+)/, "number.nan"],
      //[/(".*?"|'.*?'|[^#'"]*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]],
      //{ include: "@flowScalars" },
      /*[
        /.+?(?=(\s+#|$))/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "string"
          }
        }
      ]*/
    ],
    includeStatement: [
        { include: "@whitespace" },
        { include: '@multilineCommentStart' },
        [/(include )(@filepathFormat?)/, ['keyword', 'string']],
        [/(type )(\w*)/, ['keyword', 'string']],
        [/with /, 'keyword', '@withContent'],
        ['', 'invalid', '@pop'],
    ],
    withContent: [
        [/{/, 'bracket', '@object'],
        ['', 'invalid', '@pop'],
    ],
    namespaceBlock: [
      [/(namespace +)(\w* +)(begin)/, ['keyword', 'string', 'keyword']],
      [/end(?!\w)/, 'keyword', '@pop'],
      { include: "@namespaceContent" },
    ],
    namespaceContent: [
      { include: "@comment" },
      { include: '@multilineCommentStart' },
      { include: "@whitespace" },
      { include: "@actionStatement" },
    ],
    actionStatement: [
        { include: "@whitespace" },
        ['(?!^$)', 'string', '@statementComponents'], // not an empty string
    ],
    statementComponents: [
        { include: "@whitespace" },
        { include: "@comment" },
        { include: '@multilineCommentStart' },
        [/\'{3}/, 'comment', '@notes'], // TOFIX: not working
        [/'/, 'string', '@title'],      // title
        [/@classProp/, 'keyword'], // @Class
        [/@actionProp/, 'keyword'], // #action
        [/(?![.:\]])(=@ws*)(@numberFloat|@numberInteger|@numberInfinity|@numberNaN)/, ['operator', 'number.float']], // = 1.1
        [/([.:]=@ws*)(@mathExpr)/, ['operator', 'string']], // .= xxx, := xxx
        [/(\[@idProp?\]=@ws*)(@mathExpr)/, ['operator', 'string']], // []= xxx, [evt]= xxx        
        [/(?=(?:@ws|^|\*\/))@idProp/, 'identifier'], // id
        [/@idProp::@idProp/, 'identifier'], // namespace::id
        [/@idProp::\*/, 'identifier'], // namespace::*
        [/\{/, 'bracket', '@object'], // dictionary
        [ /\;/, 'delimiter', '@pop'], // end
    ],
    object: [
      { include: "@whitespace" },
      { include: "@comment" },
      { include: '@multilineCommentStart' },
      [/[\}]/, "bracket", "@pop"],
      [/,/, "delimiter.comma"],
      [/:(?= )/, "operators"],
      [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"],
      { include: "@flowCollections" },
      { include: "@flowScalars" },
      { include: "@flowNumber" },
      [
        /[^\},]+/,
        {
          cases: {
            //"@keywords": "keyword",
            "@default": "string"
          }
        }
      ]
    ],
    array: [
      { include: "@whitespace" },
      { include: "@comment" },
      { include: '@multilineCommentStart' },
      [/\]/, "@brackets", "@pop"],
      [/,/, "delimiter.comma"],
      { include: "@flowCollections" },
      { include: "@flowScalars" },
      { include: "@flowNumber" },
      [
        /[^\],]+/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "string"
          }
        }
      ]
    ],
    multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
    multiStringContinued: [
      [
        /^( *).+$/,
        {
          cases: {
            "$1==$S2": "string",
            "@default": { token: "@rematch", next: "@popall" }
          }
        }
      ]
    ],
    whitespace: [[/[ \t\r\n]+/, "white"]],
    comment: [[/\/\/.*$/, "comment"]],
    multilineCommentStart: [
      [/\/\*/, {token: 'comment', bracket: '@open', next: '@multilineComment'}],
    ],
    multilineComment: [
      [ /[^\/*]+/, 'comment' ],
      // [ /\/\*/, 'comment', '@push' ],    // nested comment
      [ /\*\//, {token: 'comment', bracket: '@close', next: '@pop'} ],
      [/[\/*]/, 'comment' ]
    ],
    flowCollections: [
      [/\[/, "@brackets", "@array"],
      [/\{/, "@brackets", "@object"]
    ],
    flowScalars: [
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/'[^']*'/, "string"],
      [/"/, "string", "@doubleQuotedString"]
    ],
    doubleQuotedString: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    title: [
      [/[^']+/, "string"],
      //[/@escapes/, "string.escape"],
      //[/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    notes: [
      [/.*'{3}/, "comment", '@pop'],
      //[/@escapes/, "string.escape"],
      //[/\\./, "string.escape.invalid"],
      //[/\'{3}/, "comment", "@pop"],
    ],
    flowNumber: [
      [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
      [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
      [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
      [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
    ],
  }
});

const FORMATS = { // + Exports/Modules
    json: {extension: 'json', language: 'json', template: DEFAULT_JSON_TEMPLATE}, // JSON / json
    heta: {extension: 'heta', language: 'heta', template: DEFAULT_HETA_TEMPLATE}, // HetaCode / heta
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
            title = `"${fileName}.${format.extension}" already exist. Choose another name.`
        
        } while (this.hetaEditorsStorage.has(`${fileName}.${format.extension}`))
        
        this.addEditor(`${fileName}.${format.extension}`, format.template, format.language);
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
            language: type,
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