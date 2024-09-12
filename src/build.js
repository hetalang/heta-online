import { Builder, HetaLevelError } from 'heta-compiler/src/webpack';
import packageFile from 'heta-compiler/package';
import YAML from 'js-yaml';

let contactMessage = `
 +-------------------------------------------------------------------+ 
 | Internal "Heta compiler" error, contact the developers.           | 
 | Create an issue: ${packageFile.bugs.url} | 
 | or mail to: ${packageFile.bugs.email}                                      | 
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
            postMessage({action: 'console', value: 'Error: ' + error.message + '\n'});
            postMessage({action: 'console', value: 'STOP!\n'});
        } else {
            postMessage({action: 'console', value: contactMessage + '\n'});
            postMessage({action: 'console', value: error.stack});
        }
        
        postMessage({action: 'console', value: '\n\n$ '});
        
        return; // BRAKE
    }
    
    if (builder.container.hetaErrors().length > 0) {
        postMessage({action: 'console', value: 'Compilation ERROR! See logs.\n'});
        postMessage({action: 'finished', dict: outputDict});
    } else {
        postMessage({action: 'console', value: 'Compilation OK!\n'});
        postMessage({action: 'stop', dict: outputDict});
    }

    postMessage({action: 'console', value: '\n$ '});
};

function main(inputDict, outputDict) {
    let declaration = {options: {}, importModule: {}, export: []}; // default declaration
    
    // === read declaration file ===
    // search
    let declarationFileName = ['platform.json', 'platform.yml', 'platform'].find((x) => inputDict[x]);
    let declarationBuffer = inputDict[declarationFileName];
    
    if (!declarationBuffer) {
        postMessage({action: 'console', value: 'No declaration file, running with defaults...\nSTOP!\n\n$ '});
    } else {
        postMessage({action: 'console', value: `Running compilation with declaration file "${declarationFileName}"...\n`});
        let declarationText = new TextDecoder('utf-8').decode(declarationBuffer);
        try {
          let declarationFromFile = YAML.load(declarationText);
          if (typeof declarationFromFile !== 'object'){
            throw new Error('Declation must be an object type.');
          }
          Object.assign(declaration, declarationFromFile);
        } catch (e) {
            postMessage({action: 'console', value: e.message + '\n'});

            throw new HetaLevelError('Wrong format of declaration file.\n');
        }
    }

    let minLogLevel = declaration?.options?.logLevel || 'info'; // set logLevel before declaration check
    let minLevelNum = levels.indexOf(minLogLevel);
    let tr1 = (level, msg, opt, levelNum) => {
        let value = `[${level}]\t${msg}\n`;
        if (levelNum >= minLevelNum) {
            postMessage({action: 'console', value: value});
        }
    }
    
    var builder = new Builder(declaration, '.', (fn) => {
        
        let arrayBuffer = inputDict[fn]; // Uint8Array
        if (!arrayBuffer) {
            throw new HetaLevelError(`Module ${fn} is not found,`);
        }
        return Buffer.from(arrayBuffer); // Buffer
    }, (fn, text) => {
        outputDict[fn] = Buffer.from(text, 'utf-8');
    }, [tr1]).run();

    return builder;
}
