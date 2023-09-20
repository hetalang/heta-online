import { Container } from 'heta-compiler/src/browser';
import { Transport } from 'heta-compiler/src/logger';
import * as path from 'path';

function build(hmc, hee) { // modules, exports
    //console.log(hmc);
    let coreDirname = '.';

    /*
        constructor()
    */
    // create declaration
    let declarationText = hmc.hetaEditorsStorage
        .get('platform.json')
        .monacoEditor
        .getValue();
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

    // logs after all
    //let logsText = JSON.stringify(c.defaultLogs, null, '  ');
    //console.log(logsText);
}

export default build;
