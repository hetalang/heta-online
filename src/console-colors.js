import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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
  base: 'vs',
  inherit: true,
  colors: {},
  rules: [
      { token: 'custom-info', foreground: '000099'},
      { token: 'custom-warn', foreground: 'FFA500'},
      { token: 'custom-error', foreground: 'ff0000'},
  ],
});
monaco.editor.setTheme('myCoolTheme');