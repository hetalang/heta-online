import { Container, ModuleSystem, Transpot } from 'heta-compiler/src/webpack';
import path from 'path';
import declarationSchema from 'heta-compiler/src/builder/declaration-schema.json';
import Ajv from 'ajv';
//const ajvErrors = require('ajv-errors');
import hetaCompilerPackage from 'heta-compiler/package.json';
import semver from 'semver';

self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
    self.requestFileSystemSync;
self.resolveLocalFileSystemSyncURL = self.webkitResolveLocalFileSystemSyncURL ||
    self.resolveLocalFileSystemSyncURL;

const reader = new FileReaderSync();

let ajv = new Ajv({allErrors: true, useDefaults: true});
ajv.addKeyword({
    keyword: "example",
    type: "string",
});
//ajvErrors(ajv, {singleError: false}); // this is required for custom messages see https://ajv.js.org/packages/ajv-errors.html
const validate = ajv.compile(declarationSchema);

let contactMessage = `
 +-------------------------------------------------------------------+ 
 | Internal "Heta compiler" error, contact the developers.           | 
 | Create an issue: ${hetaCompilerPackage.bugs.url} | 
 | or mail to: ${hetaCompilerPackage.bugs.email}                                     | 
 +-------------------------------------------------------------------+ 
`;

self.onmessage = (evt) => {
    // first lines in console
    postMessage({action: 'console', value: 'heta build', append: true});
    postMessage({action: 'console', value: '\nRunning compilation with declaration file "/platform.json"...', append: true});

    // create declaration
    let declarationFile = self.resolveLocalFileSystemSyncURL(evt.data.url + '/platform.json').file();
    let declarationText = reader.readAsText(declarationFile);
    try {
        var declaration = JSON.parse(declarationText);
    } catch (e) {
        postMessage({action: 'console', value: `\nDeclaration file must be JSON formatted:`, append: true});
        postMessage({action: 'console', value: `\n\t- ${e.message}`, append: true});
        
        postMessage({action: 'console', value: '\n\n$ ', append: true});
        return;
    }

    // validate and set defaults
    let valid = validate(declaration);
    if (!valid) { // analyze errors
        postMessage({action: 'console', value: '\nErrors in declaration file:', append: true});
        validate.errors.forEach((ajvError) => {
            let msg = `\n\t- "${ajvError.instancePath}" ${ajvError.message}`;
            postMessage({action: 'console', value: msg, append: true});
        });

        postMessage({action: 'console', value: '\n\n$ ', append: true});
        return;
    }

    // === wrong version throws, if no version stated than skip ===
    let satisfiesVersion = semver.satisfies(hetaCompilerPackage.version, declaration.builderVersion);
    if (!satisfiesVersion) {
        postMessage({action: 'console', value: `\nVersion requirements (${declaration.builderVersion}) don't meet builder version ${hetaCompilerPackage.version}.`, append: true});
        
        postMessage({action: 'console', value: '\n\n$ ', append: true});
        return;
    }

    // === this part displays "send errors to developer" message ===
    try {
        var container = build(evt.data.url, declaration);
    } catch(error) {
        postMessage({action: 'console', value: contactMessage + '\n', append: true});
        postMessage({action: 'console', value: error.stack, append: true});

        postMessage({action: 'console', value: '\n\n$ ', append: true});
        return;
    }

    if (container.hetaErrors().length > 0) {
        postMessage({action: 'console', value: '\nCompilation ERROR! See logs.', append: true});
    } else {
        postMessage({action: 'console', value: '\nCompilation OK!', append: true});
    }

    postMessage({action: 'console', value: '\n\n$ ', append: true});
};

function build(url, settings) { // modules, exports
    let coreDirname = '/';
    /*
        constructor()
    */

    // create container and logger
    let c = new Container();
    /*
    c.logger.addTransport((level, msg, opt, levelNum) => { // temporal solution, all logs to console
        console.log(`{heta-compiler} [${level}]\t${msg}`);
    });
    */
    c.logger.addTransport((level, msg, opt, levelNum) => {
        let value = `\n[${level}]\t${msg}`;

        postMessage({action: 'console', value: value, append: true});
    });

    // file paths
    let _coreDirname = path.resolve(coreDirname);
    let _distDirname = path.resolve(coreDirname, settings.options.distDir);
    let _metaDirname = path.resolve(coreDirname, settings.options.metaDir);
    let _logPath = path.resolve(coreDirname, settings.options.logPath);

    c.logger.info(`Heta builder of version ${hetaCompilerPackage.version} initialized in directory "${_coreDirname}"`);
    if (settings.id) c.logger.info(`Platform id: "${settings.id}"`);

    /*
        run()
    */
    c.logger.info(`Compilation of module "${settings.importModule.source}" of type "${settings.importModule.type}"...`);

    // 1. Parsing
    let ms = new ModuleSystem(c.logger, (filename) => {
        try {
            let file = self.resolveLocalFileSystemSyncURL(url + filename).file();
            var arrayBuffer = reader.readAsArrayBuffer(file);
        } catch (e) {
            throw new Error(`File ${filename} is not found.`);
        }
        
        return Buffer.from(arrayBuffer);
    });
    let absFilename = path.join(_coreDirname, settings.importModule.source);
    let sourceType = settings.importModule.type;
    ms.addModuleDeep(absFilename, sourceType, settings.importModule);

    // 2. Modules integration
    if (settings.options.debug) {
        Object.values(ms.moduleCollection).forEach((value) => {
          let relPath = path.relative(_coreDirname, value.filename + '.json');
          let absPath = path.join(_metaDirname, relPath);
          let str = JSON.stringify(value.parsed, null, 2);
          fs.outputFileSync(absPath, str);
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
        if (settings.options.unitsCheck) {
          c.logger.info('Checking unit\'s consistency.');
          c.checkUnits();
        } else {
          c.logger.warn('Units checking skipped. To turn it on set "unitsCheck: true" in declaration.');
        }

        // 8. Terms checking
        c.logger.info('Checking unit\'s terms.');
        c.checkTerms();

        // 9. Exports
        // create dist dir
        var distDirectoryEntry = self.resolveLocalFileSystemSyncURL(url)
            .getDirectory(_distDirname, {create: true});
        // save
        if (settings.options.skipExport) {
            c.logger.warn('Exporting skipped as stated in declaration.');
        } else if (settings.options.juliaOnly) {
            c.logger.warn('"Julia only" mode');
            //this.exportJuliaOnly(); 
            // create export without putting it to exportStorage
            let Julia = this.container.classes['Julia'];
            let exportItem = new Julia({
                format: 'Julia',
                filepath: '_julia'
            });

            _makeAndSave(exportItem, distDirectoryEntry);
        } else {
            //this.exportMany();
            let exportElements = [...c.exportStorage].map((x) => x[1]);
            c.logger.info(`Start exporting to files, total: ${exportElements.length}.`);

            exportElements.forEach((exportItem) => _makeAndSave(exportItem, distDirectoryEntry));
        }
      } else {
        c.logger.warn('Units checking and export were skipped because of errors in compilation.');
      }

    // 10. save logs if required
    let hetaErrors = c.hetaErrors();
    let createLog = settings.options.logMode === 'always' 
      || (settings.options.logMode === 'error' && hetaErrors.length > 0);
    if (createLog) {
      switch (settings.options.logFormat) {
      case 'json':
        var logs = JSON.stringify(c.defaultLogs, null, 2);
        break;
      default: 
        logs = c.defaultLogs
          .map(x => `[${x.level}]\t${x.msg}`)
          .join('\n');  
      }

      //fs.outputFileSync(_logPath, logs);
      self.resolveLocalFileSystemSyncURL(url)
        .getFile(_logPath, {create: true})
        .createWriter()
        .write(new Blob([logs], { type: "text/plain" }));
      c.logger.info(`All logs was saved to file: "${_logPath}"`);
    }

    if (!c.logger.hasErrors) {
        postMessage({action: 'finished', dist: _distDirname});
    } else {
        postMessage({action: 'stop'});
    }

    // XXX: TEMP for testing
    //let entries = distDirectoryEntry?.createReader().readEntries();
    //console.log(entries);
    
    return c;
}

function _makeAndSave(exportItem, distDirectoryEntry) {
    let logger = exportItem._container.logger;
    let absPath = path.resolve(distDirectoryEntry.fullPath, exportItem.filepath); // /dist/matlab
    let msg = `Exporting to "${absPath}" of format "${exportItem.format}"...`;
    logger.info(msg);

    let mmm = exportItem.make();

    if (mmm.length > 1) {
        var dirToSave = distDirectoryEntry.getDirectory(exportItem.filepath, {create: true});
    } else {
        dirToSave = distDirectoryEntry;
    }

    mmm.forEach((out) => {
        let fileName = (exportItem.filepath + out.pathSuffix)
            .split('/')
            .pop();
        try {
            let blob = new Blob([out.content]);
            dirToSave.getFile(fileName, {create: true, exclusive: true})
                .createWriter()
                .write(blob);
        } catch (e) {
            let msg =`Heta compiler cannot export to file: "${e.path}" because it is busy.`;
            logger.error(msg, {type: 'ExportError'});
        }
    });
}