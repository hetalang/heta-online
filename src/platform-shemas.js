/*
  This block is responsible for configuring the Monaco Editor to support JSON and YAML schemas.
*/
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { jsonDefaults } from 'monaco-editor/esm/vs/language/json/monaco.contribution';

import { configureMonacoYaml } from 'monaco-yaml';

//import declarationSchema from 'heta-compiler/src/builder/declaration-schema.json';

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

jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true
});

// This part is for the YAML language schema support
// This highlights the wrong lines in the editor.
// Currently is temporarily disabled because of errors.
/*
configureMonacoYaml(monaco, {
    enableSchemaRequest: true, // XXX: Does not work
    //hover: true, // Enable hover information
    //completion: true, // Enable auto-completion
    validate: true, // Enable validation
    //format: true, // Enable formatting
});
*/