import * as monaco from 'monaco-editor';//'monaco-editor/esm/vs/editor/editor.api';

monaco.languages.register({id: 'console'});
monaco.languages.setMonarchTokensProvider('console', {
  defaultToken: 'text',
  tokenizer: {
    root: [
      [/\[info\]/, 'custom-info'],
      [/\[warn\]/, 'custom-warn'],
      [/\[error\]/, 'custom-error'],
    ]
  }
});

monaco.editor.defineTheme('myCoolTheme', {
  base: 'vs-dark',
  inherit: false,
  colors: {
    'editor.foreground': '#BDAE9D',
    'editor.background': '#2A211C',
  },
  rules: [
      { token: 'custom-info', foreground: '000099'},
      { token: 'custom-warn', foreground: 'FFA500'},
      { token: 'custom-error', foreground: 'ff0000'},
  ],
});
