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
    const inputDict = evt.data.files;
    const outputDict = {}; // {<filepath>: <Buffer>}

    // first lines in console
    postMessage({action: 'console', value: 'heta build'});

    // search declaration
    let declarationFileName = ['/platform.json', '/platform.json5', '/platform.yml'].find((x) => inputDict[x]);
    let declarationBuffer = inputDict[declarationFileName];
    if (!declarationBuffer) {
        postMessage({action: 'console', value: '\n"platform.*" file is not found.\nSTOP!\n\n$ '});
        return; // BRAKE
    }

    postMessage({action: 'console', value: `\nRunning compilation with declaration file "${declarationFileName}"...`});
    let declarationText = new TextDecoder('utf-8').decode(declarationBuffer);
    try {
        var declaration = YAML.load(declarationText);
    } catch (e) {
        postMessage({action: 'console', value: `\nDeclaration file must be ΥΑΜL/JSON formatted:`});
        postMessage({action: 'console', value: `\n\t- ${e.message}`});
        
        postMessage({action: 'console', value: '\n\n$ '});
        return; // BRAKE
    }

    // === wrong version throws, if no version stated than skip ===
    let satisfiesVersion = semver.satisfies(hetaCompilerPackage.version, declaration.builderVersion);
    if (!satisfiesVersion) {
        postMessage({action: 'console', value: `\nVersion requirements (${declaration.builderVersion}) don't meet builder version ${hetaCompilerPackage.version}.`});
        
        postMessage({action: 'console', value: '\n\n$ '});
        return;
    }

    // === this part displays "send errors to developer" message ===
    try {
        let minLogLevel = declaration.options?.logLevel || 'info';
        let minLevelNum = levels.indexOf(minLogLevel);
        var container = build(declaration, '/', (fn) => {
            let arrayBuffer = inputDict[fn]; // Uint8Array
            if (!arrayBuffer) {
                throw new HetaLevelError(`Module ${filename} is not found.`);
            }
            return Buffer.from(arrayBuffer); // Buffer
        }, (fn, text) => {
            outputDict[fn] = Buffer.from(text, 'utf-8');
        }, [(level, msg, opt, levelNum) => {
            let value = `\n[${level}]\t${msg}`;
            if (levelNum >= minLevelNum) {
                postMessage({action: 'console', value: value});
            }
        }]);
    
    } catch (error) {
        if (error.name === 'HetaLevelError') {
            //process.stdout.write(error.message + '\nSTOP!\n');
            postMessage({action: 'console', value: '\n' + error.message + '\n'});
        } else {
            postMessage({action: 'console', value: contactMessage + '\n'});
            postMessage({action: 'console', value: error.stack});

            postMessage({action: 'console', value: '\n\n$ '});
        }
        
        postMessage({action: 'console', value: '\n\n$ '});
        
        return; // BRAKE
    }

    if (!container.logger.hasErrors) {
        postMessage({action: 'finished', dict: outputDict});
    } else {
        postMessage({action: 'stop', dict: outputDict});
    }

    postMessage({action: 'console', value: '\n\n$ '});
};

function build(
    declaration = {},
    coreDirname = '.',
    fileReadHandler = (fn) => { throw new Error('File read is not set for Builder'); }, // must return text
    fileWriteHandler = (fn, text) => { throw new Error('File write is not set for Builder'); }, // must return undefined
    transportArray = [] // Builder-level Transport
) { // modules, export
    /*
        constructor()
    */

    // create container and logger
    let c = new Container();

    let _builder = { // pseudo builder
        container: c,
        logger: c.logger,
        fileReadHandler,
        fileWriteHandler,
        exportArray: [],
        export: []
    }; // back reference
    
    _builder.exportClasses = {};
    Object.entries(Builder._exportClasses).forEach(([key, _Class]) => {
        _builder.exportClasses[key] = class extends _Class {};
        _builder.exportClasses[key].prototype._builder = _builder;
    });
    c._builder = _builder;
    
    c.logger.addTransport(transportArray[0]);

    // validate and set defaults
    let valid = validate(declaration);
    if (!valid) {
        // convert validation errors to heta errors
        validate.errors.forEach((x) => {
            c.logger.error(`\n\t-${x.message} (${x.dataPath})`, {type: 'BuilderError', params: x.params});
        });
        throw new HetaLevelError('Wrong structure of platform file.');
    }

    // file paths
    let _coreDirname = path.resolve(coreDirname);
    let _distDirname = path.resolve(coreDirname, declaration.options.distDir);
    let _metaDirname = path.resolve(coreDirname, declaration.options.metaDir);
    let _logPath = path.resolve(coreDirname, declaration.options.logPath);

    c.logger.info(`Heta builder of version ${hetaCompilerPackage.version} initialized in directory "${_coreDirname}"`);
    if (declaration.id) c.logger.info(`Platform id: "${declaration.id}"`);

    /*
        run()
    */
    c.logger.info(`Compilation of module "${declaration.importModule.source}" of type "${declaration.importModule.type}"...`);

    // 1. Parsing
    let ms = new ModuleSystem(c.logger, fileReadHandler);
    let sourceFilepath = path.resolve(_coreDirname, declaration.importModule.source);
    let sourceType = declaration.importModule.type;
    ms.addModuleDeep(sourceFilepath, sourceType, declaration.importModule);

    // 2. Modules integration
    if (declaration.options.debug) {
        Object.getOwnPropertyNames(ms.moduleCollection).forEach((name) => {
            let relPath = path.relative(_coreDirname, name + '.json');
            let absPath = path.join(_metaDirname, relPath);
            let str = JSON.stringify(ms.moduleCollection[name], null, 2);
            _builder.fileWriteHandler(absPath, str);
            c.logger.info(`Meta file was saved to ${absPath}`);
        });
    }
    let qArr = ms.integrate();
    
    // 3. Translation
    c.loadMany(qArr, false);
    
    // 4. Binding
    c.logger.info('Setting references in elements, total length ' + c.length);
    c.knitMany();
    
    // 5. Circular start_ and ode_
    c.logger.info('Checking for circular references in Records.');
    c.checkCircRecord();
    
    // 6. check circ UnitDef
    c.checkCircUnitDef();

    // === STOP if errors ===
    if (!c.logger.hasErrors) {
        // 7. Units checking
        if (declaration.options.unitsCheck) {
          c.logger.info('Checking unit\'s consistency.');
          c.checkUnits();
        } else {
          c.logger.warn('Units checking skipped. To turn it on set "unitsCheck: true" in declaration.');
        }

        // 8. Terms checking
        c.logger.info('Checking unit\'s terms.');
        c.checkTerms();

        // 9. Exports
        let exportElements = _builder.exportArray;
        c.logger.info(`Start exporting to files, total: ${exportElements.length}.`);

        exportElements.forEach((exportItem) => _makeAndSave(exportItem, _distDirname));
      } else {
        c.logger.warn('Units checking and export were skipped because of errors in compilation.');
      }

    // 10. save logs if required
    let hetaErrors = c.hetaErrors();
    let createLog = declaration.options.logMode === 'always' 
      || (declaration.options.logMode === 'error' && hetaErrors.length > 0);
    if (createLog) {
      switch (declaration.options.logFormat) {
      case 'json':
        var logs = JSON.stringify(c.defaultLogs, null, 2);
        break;
      default: 
        let minLogLevel = declaration.options?.logLevel || 'info';
        let minLevelNum = levels.indexOf(minLogLevel);
        logs = c.defaultLogs
          .filter(x => x.levelNum >= minLevelNum)
          .map(x => `[${x.level}]\t${x.msg}`)
          .join('\n');  
      }

      _builder.fileWriteHandler(_logPath, logs);
      c.logger.info(`All logs was saved to file: "${_logPath}"`);
    }

    return c;
}

function _makeAndSave(exportItem, distDirectory) {
    let { logger, fileWriteHandler } = exportItem._builder;
    let filepath0 = path.resolve(distDirectory, exportItem.filepath); // /dist/matlab
    let msg = `Exporting to "${filepath0}" of format "${exportItem.format}"...`;
    logger.info(msg);

    let mmm = exportItem.make();

    mmm.forEach((out) => {
        let filepath = filepath0 + out.pathSuffix; // /dist/matlab/run.jl
        try {
            fileWriteHandler(filepath, out.content);
        } catch (e) {
            let msg =`Heta compiler cannot export to file: "${filepath}": \n\t- ${e.message}`;
            logger.error(msg, {type: 'ExportError'});
        }
    });
}
