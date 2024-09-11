import { Builder, Container, ModuleSystem, HetaLevelError } from 'heta-compiler/src/webpack';
import path from 'path';
import declarationSchema from 'heta-compiler/src/builder/declaration-schema.json';
import Ajv from 'ajv';
import hetaCompilerPackage from 'heta-compiler/package';
import semver from 'semver';
import YAML from 'js-yaml';
import ajvErrors from 'ajv-errors';

let ajv = new Ajv({allErrors: true, useDefaults: true});
ajv.addKeyword({keyword: "example"});
ajvErrors(ajv);

//ajvErrors(ajv, {singleError: false}); // this is required for custom messages see https://ajv.js.org/packages/ajv-errors.html
const validate = ajv.compile(declarationSchema);

let contactMessage = `
 +-------------------------------------------------------------------+ 
 | Internal "Heta compiler" error, contact the developers.           | 
 | Create an issue: ${hetaCompilerPackage.bugs.url} | 
 | or mail to: ${hetaCompilerPackage.bugs.email}                                      | 
 +-------------------------------------------------------------------+ 
`;

const levels = [
    'debug', // 0
    'info', // 1
    'warn', // 2
    'error', // 3
    'panic' // 4
];

self.onmessage = (evt) => {
    const outputDict = {}; // {<filepath>: <Buffer>}

    // first lines in console
    postMessage({action: 'console', value: 'heta build\n'});

    // === this part displays "send errors to developer" message ===
    try {
        var builder = main(evt.data.files, outputDict);
    } catch (error) {
        if (error.name === 'HetaLevelError') {
            postMessage({action: 'console', value: 'Compilation ERROR! See logs.\n'});
        } else {
            postMessage({action: 'console', value: contactMessage + '\n'});
            postMessage({action: 'console', value: error.stack});
        }
        
        postMessage({action: 'console', value: '\n\n$ '});
        
        return; // BRAKE
    }

    if (builder.container.hetaErrors().length > 0) {
        postMessage({action: 'finished', dict: outputDict});
    } else {
        postMessage({action: 'stop', dict: outputDict});
    }

    postMessage({action: 'console', value: '\n\n$ '});
};

function main(inputDict, outputDict) {
    // === read declaration file ===
    // search
    let declarationFileName = ['/platform.json', '/platform.json5', '/platform.yml'].find((x) => inputDict[x]);
    let declarationBuffer = inputDict[declarationFileName];

    let declaration = {options: {}, importModule: {}, export: []}; // default declaration

    if (!declarationBuffer) {
        postMessage({action: 'console', value: 'No declaration file, running with defaults...\n\nSTOP!\n\n$ '});
        return; // BRAKE
    } else {
        postMessage({action: 'console', value: `Running compilation with declaration file "${declarationFileName}"...\n`});
        let declarationText = new TextDecoder('utf-8').decode(declarationBuffer);
        try {
          let declarationFromFile = YAML.load(declarationText);
          if (typeof declarationFromFile !== 'object'){
            throw new Error('Not an object.');
          }
          Object.assign(declaration, declarationFromFile);
        } catch (e) {
            postMessage({action: 'console', value: `\nWrong format of declaration file: \n"${e.message}"\n`});
        
            postMessage({action: 'console', value: '\n\n$ '});
            return; // BRAKE
        }
    }

    
    // === wrong version throws, if no version stated than skip ===
    let satisfiesVersion = declaration.builderVersion
        ? semver.satisfies(hetaCompilerPackage.version, declaration.builderVersion)
        : true;
    if (!satisfiesVersion) {
        postMessage({action: 'console', value: `\nVersion "${declaration.builderVersion}" stated in declaration file is not supported by the builder.\n`});
        
        postMessage({action: 'console', value: '\n\n$ '});
        return; // BRAKE
    }

    let minLogLevel = declaration?.options?.logLevel || 'info'; // set logLevel before declaration check
    let minLevelNum = levels.indexOf(minLogLevel);
    let tr1 = (level, msg, opt, levelNum) => {
        let value = `[${level}]\t${msg}\n`;
        if (levelNum >= minLevelNum) {
            postMessage({action: 'console', value: value});
        }
    }
    var builder = new Builder(declaration, '/', (fn) => {
        let arrayBuffer = inputDict[fn]; // Uint8Array
        if (!arrayBuffer) {
            throw new HetaLevelError(`Module ${filename} is not found.`);
        }
        return Buffer.from(arrayBuffer); // Buffer
    }, (fn, text) => {
        outputDict[fn] = Buffer.from(text, 'utf-8');
    }, [tr1]).run();

    return builder;
}
