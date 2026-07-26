/*
  This block is responsible for configuring the Monaco Editor to support JSON and YAML schemas.
*/
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { jsonDefaults } from 'monaco-editor/esm/vs/language/json/monaco.contribution';

import { configureMonacoYaml } from 'monaco-yaml';

// heta-compiler does not export this file through its package entry points.
import declarationSchema from '../node_modules/heta-compiler/src/builder/declaration-schema.json';

const PLATFORM_SCHEMA_URI = 'https://hetalang.github.io/heta-compiler/declaration-schema.json';

// monaco-yaml's worker manager still passes createData/label/moduleId here.
// Monaco 0.55 expects a Worker instance instead, otherwise it silently falls
// back to an editor-only worker which has no YAML language-service methods.
const yamlMonaco = {
    ...monaco,
    editor: {
        ...monaco.editor,
        createWebWorker({createData}) {
            const worker = new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
            worker.postMessage('ignore');
            worker.postMessage(createData);

            return monaco.editor.createWebWorker({worker});
        }
    }
};

jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true
});

// Apply the compiler schema directly rather than requesting it from the network.
// This keeps validation and completions available offline and avoids CORS failures
// in the YAML worker.
configureMonacoYaml(yamlMonaco, {
    completion: true,
    hover: true,
    validate: true,
    schemas: [
        {
            uri: PLATFORM_SCHEMA_URI,
            fileMatch: ['**/platform.yml'],
            schema: declarationSchema
        }
    ]
});
