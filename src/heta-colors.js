import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.languages.register({id: 'heta'});
monaco.languages.setMonarchTokensProvider('heta', {
  defaultToken: 'invalid',
  keywords: ['abstract', 'concrete', 'namespace', 'include', 'type', 'with', 'begin', 'end', 'true', 'false', 'Inf', 'NaN'],
  //tokenPostfix: ".heta",
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
  mathSymbols: /[\w\s*\+\-\*\/\^\(\)\.\>\<\=\!\?\,]/,
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
      [
        /((?:abstract[ \t]+|concrete[ \t]+)?namespace)([ \t]+@idProp)/,
        ['keyword', {token: 'string', next: '@namespaceBlock'}]
      ],
      [/block /, 'keyword', '@defaultBlock'],
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
      { include: "@whitespace" },
      [/;/, 'delimiter', '@pop'],
      [/begin/, 'keyword', '@block']
    ],
    defaultBlock: [
      [/begin/, 'keyword', '@block'],
      [/{/, 'bracket', '@object'],
    ],
    block: [
      [/end(?!\w)/, 'keyword', '@popall'],
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
        [/\'{3}/, 'comment', '@notes'], // not working
        [/\'/, 'string', '@title'],      // title
        [/@classProp/, 'keyword'], // @Class
        [/@actionProp/, 'keyword'], // #action
        [/(?![.:\]])(=@ws*)(@numberFloat|@numberInteger|@numberInfinity|@numberNaN)/, ['operator', 'number.float']], // = 1.1
        [/[.:]=@ws*/, 'operator', '@mathExpr'], // .= xxx, := xxx
        [/\[@idProp?\]=@ws*/, 'operator', '@mathExpr'], // []= xxx, [evt]= xxx
        
        [/@idProp::@idProp/, 'identifier'], // namespace::id
        [/@idProp::\*/, 'identifier'], // namespace::*
        [/@idProp/, 'identifier'], // id
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
    mathExpr: [
      //{include: '@whitespace'},
      [/@mathSymbols+/, 'string'],
      ['^$', 'string'],
      ['', 'string', '@pop'],
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
      [/'/, "string", "@pop"]
    ],
    notes: [
      [/[^']+/, 'comment'],
      [/'{3}/, "comment", "@pop"],
      [/'/, 'comment']
    ],
    flowNumber: [
      [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
      [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
      [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
      [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
    ],
  }
});
