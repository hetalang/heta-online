import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import declarationSchema from 'heta-compiler/src/builder/declaration-schema.json';

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
        {
            uri: "https://github.com/hetalang/heta-compiler/declaration-schema.json",
            fileMatch: ['*'],
            schema: declarationSchema
        }
    ]
});
