import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
//import declarationSchema from 'heta-compiler/src/builder/declaration-schema.json';
//import { configureMonacoYaml } from 'monaco-yaml';

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true
});

/*
configureMonacoYaml(monaco, {
    enableSchemaRequest: true, // XXX: Does not work
    //hover: true, // Enable hover information
    //completion: true, // Enable auto-completion
    validate: true, // Enable validation
    //format: true, // Enable formatting
});

window.MonacoEnvironment = {
    getWorker(moduleId, label) {
      switch (label) {
        case 'editorWorkerService':
          return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
        case 'yaml':
          return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
        case 'json':
          return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
        default:
          throw new Error(`Unknown label ${label}`);
      }
    }
};
*/