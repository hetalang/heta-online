import { Container, ModuleSystem, Transpot} from 'heta-compiler/src/browser';
import path from 'path';

self.requestFileSystemSync = self.webkitRequestFileSystemSync ||
    self.requestFileSystemSync;
self.resolveLocalFileSystemSyncURL = self.webkitResolveLocalFileSystemSyncURL ||
    self.resolveLocalFileSystemSyncURL;

//const FS = requestFileSystemSync(TEMPORARY, 10*1024*1024 /*10MB*/);

self.onmessage = (evt) => {
    let url = evt.data.url;
    build(url);
};

function build(url) { // modules, exports
    let coreDirname = '/';
    /*
        constructor()
    */
    // create declaration
    let reader = new FileReaderSync();
    let declarationFile = self.resolveLocalFileSystemSyncURL(url + 'platform.json').file();
    let declarationText = reader.readAsText(declarationFile);

    let declaration = JSON.parse(declarationText);

    // TODO: check declaration and set defaults
    let minLogLevel = declaration.options?.logLevel || 'info'; // default logLevel

    // create container and logger
    let c = new Container();
    c.logger.addTransport((level, msg, opt, levelNum) => { // temporal solution, all logs to console
        console.log(`{heta-compiler} [${level}]\t${msg}`);
    });

    // file paths
    let _coreDirname = path.resolve(coreDirname);
    let _distDirname = path.resolve(coreDirname, declaration.options?.distDir || 'dist');
    let _metaDirname = path.resolve(coreDirname, declaration.options?.metaDir || 'meta');
    let _logPath = path.resolve(coreDirname, declaration.options?.logPath || 'build.log');

    c.logger.info(`Builder initialized in directory "${_coreDirname}"`);
    if (declaration.id) c.logger.info(`Platform id: "${declaration.id}"`);

    /*
        run()
    */
    c.logger.info(`Compilation of module "${declaration.importModule?.source || 'index.heta'}" of type "${declaration.importModule?.type || 'heta'}"...`);

    // 1. Parsing
    let ms = new ModuleSystem(c.logger, (filename) => {
        let stream = self.resolveLocalFileSystemSyncURL(url + filename).file().stream();

        return stream;
    });
    let absFilename = path.join(_coreDirname, declaration.importModule?.source || 'index.heta');
    //ms.addModuleDeep(absFilename, declaration.importModule?.type || 'heta', declaration.importModule);

    // logs after all
    //let logsText = JSON.stringify(c.defaultLogs, null, '  ');
    //console.log(logsText);
}
