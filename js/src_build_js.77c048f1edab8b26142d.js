/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/build.js":
/*!**********************!*\
  !*** ./src/build.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! heta-compiler/src/webpack */ "./node_modules/heta-compiler/src/webpack.js");
/* harmony import */ var heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var heta_compiler_src_builder_declaration_schema_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! heta-compiler/src/builder/declaration-schema.json */ "./node_modules/heta-compiler/src/builder/declaration-schema.json");
/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ajv */ "./node_modules/ajv/dist/ajv.js");
/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ajv__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! heta-compiler/package.json */ "./node_modules/heta-compiler/package.json");
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! semver */ "./node_modules/semver/index.js");
/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(semver__WEBPACK_IMPORTED_MODULE_5__);
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }




//const ajvErrors = require('ajv-errors');


self.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;
self.resolveLocalFileSystemSyncURL = self.webkitResolveLocalFileSystemSyncURL || self.resolveLocalFileSystemSyncURL;
var reader = new FileReaderSync();
var ajv = new (ajv__WEBPACK_IMPORTED_MODULE_3___default())({
  allErrors: true,
  useDefaults: true
});
ajv.addKeyword({
  keyword: "example",
  type: "string"
});
//ajvErrors(ajv, {singleError: false}); // this is required for custom messages see https://ajv.js.org/packages/ajv-errors.html
var validate = ajv.compile(heta_compiler_src_builder_declaration_schema_json__WEBPACK_IMPORTED_MODULE_2__);
var contactMessage = "\n +-------------------------------------------------------------------+ \n | Internal \"Heta compiler\" error, contact the developers.           | \n | Create an issue: ".concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.bugs.url, " | \n | or mail to: ").concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.bugs.email, "                                     | \n +-------------------------------------------------------------------+ \n");
self.onmessage = function (evt) {
  // first lines in console
  postMessage({
    action: 'console',
    value: 'heta build',
    append: true
  });
  postMessage({
    action: 'console',
    value: '\nRunning compilation with declaration file "/platform.json"...',
    append: true
  });

  // create declaration
  var declarationFile = self.resolveLocalFileSystemSyncURL(evt.data.url + '/platform.json').file();
  var declarationText = reader.readAsText(declarationFile);
  try {
    var declaration = JSON.parse(declarationText);
  } catch (e) {
    postMessage({
      action: 'console',
      value: "\nDeclaration file must be JSON formatted:",
      append: true
    });
    postMessage({
      action: 'console',
      value: "\n\t- ".concat(e.message),
      append: true
    });
    postMessage({
      action: 'console',
      value: '\n\n$ ',
      append: true
    });
    return;
  }

  // validate and set defaults
  var valid = validate(declaration);
  if (!valid) {
    // analyze errors
    postMessage({
      action: 'console',
      value: '\nErrors in declaration file:',
      append: true
    });
    validate.errors.forEach(function (ajvError) {
      var msg = "\n\t- \"".concat(ajvError.instancePath, "\" ").concat(ajvError.message);
      postMessage({
        action: 'console',
        value: msg,
        append: true
      });
    });
    postMessage({
      action: 'console',
      value: '\n\n$ ',
      append: true
    });
    return;
  }

  // === wrong version throws, if no version stated than skip ===
  var satisfiesVersion = semver__WEBPACK_IMPORTED_MODULE_5___default().satisfies(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, declaration.builderVersion);
  if (!satisfiesVersion) {
    postMessage({
      action: 'console',
      value: "\nVersion requirements (".concat(declaration.builderVersion, ") don't meet builder version ").concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, "."),
      append: true
    });
    postMessage({
      action: 'console',
      value: '\n\n$ ',
      append: true
    });
    return;
  }

  // === this part displays "send errors to developer" message ===
  try {
    var container = build(evt.data.url, declaration);
  } catch (error) {
    postMessage({
      action: 'console',
      value: contactMessage + '\n',
      append: true
    });
    postMessage({
      action: 'console',
      value: error.stack,
      append: true
    });
    postMessage({
      action: 'console',
      value: '\n\n$ ',
      append: true
    });
    return;
  }
  if (container.hetaErrors().length > 0) {
    postMessage({
      action: 'console',
      value: '\nCompilation ERROR! See logs.',
      append: true
    });
  } else {
    postMessage({
      action: 'console',
      value: '\nCompilation OK!',
      append: true
    });
  }
  postMessage({
    action: 'console',
    value: '\n\n$ ',
    append: true
  });
};
function build(url, settings) {
  // modules, exports
  var coreDirname = '/';
  /*
      constructor()
  */

  // create container and logger
  var c = new heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__.Container();
  /*
  c.logger.addTransport((level, msg, opt, levelNum) => { // temporal solution, all logs to console
      console.log(`{heta-compiler} [${level}]\t${msg}`);
  });
  */
  c.logger.addTransport(function (level, msg, opt, levelNum) {
    var value = "\n[".concat(level, "]\t").concat(msg);
    postMessage({
      action: 'console',
      value: value,
      append: true
    });
  });

  // file paths
  var _coreDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname);
  var _distDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.distDir);
  var _metaDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.metaDir);
  var _logPath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.logPath);
  c.logger.info("Heta builder of version ".concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, " initialized in directory \"").concat(_coreDirname, "\""));
  if (settings.id) c.logger.info("Platform id: \"".concat(settings.id, "\""));

  /*
      run()
  */
  c.logger.info("Compilation of module \"".concat(settings.importModule.source, "\" of type \"").concat(settings.importModule.type, "\"..."));

  // 1. Parsing
  var ms = new heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__.ModuleSystem(c.logger, function (filename) {
    try {
      var file = self.resolveLocalFileSystemSyncURL(url + filename).file();
      var arrayBuffer = reader.readAsArrayBuffer(file);
    } catch (e) {
      throw new Error("File ".concat(filename, " is not found."));
    }
    return Buffer.from(arrayBuffer);
  });
  var absFilename = path__WEBPACK_IMPORTED_MODULE_1___default().join(_coreDirname, settings.importModule.source);
  var sourceType = settings.importModule.type;
  ms.addModuleDeep(absFilename, sourceType, settings.importModule);

  // 2. Modules integration
  if (settings.options.debug) {
    Object.values(ms.moduleCollection).forEach(function (value) {
      var relPath = path__WEBPACK_IMPORTED_MODULE_1___default().relative(_coreDirname, value.filename + '.json');
      var absPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(_metaDirname, relPath);
      var str = JSON.stringify(value.parsed, null, 2);
      fs.outputFileSync(absPath, str);
      c.logger.info("Meta file was saved to ".concat(absPath));
    });
  }
  var qArr = ms.integrate();

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
    var distDirectoryEntry = self.resolveLocalFileSystemSyncURL(url).getDirectory(_distDirname, {
      create: true
    });
    // save
    if (settings.options.skipExport) {
      c.logger.warn('Exporting skipped as stated in declaration.');
    } else if (settings.options.juliaOnly) {
      c.logger.warn('"Julia only" mode');
      //this.exportJuliaOnly(); 
      // create export without putting it to exportStorage
      var Julia = this.container.classes['Julia'];
      var exportItem = new Julia({
        format: 'Julia',
        filepath: '_julia'
      });
      _makeAndSave(exportItem, distDirectoryEntry);
    } else {
      //this.exportMany();
      var exportElements = _toConsumableArray(c.exportStorage).map(function (x) {
        return x[1];
      });
      c.logger.info("Start exporting to files, total: ".concat(exportElements.length, "."));
      exportElements.forEach(function (exportItem) {
        return _makeAndSave(exportItem, distDirectoryEntry);
      });
    }
  } else {
    c.logger.warn('Units checking and export were skipped because of errors in compilation.');
  }

  // 10. save logs if required
  var hetaErrors = c.hetaErrors();
  var createLog = settings.options.logMode === 'always' || settings.options.logMode === 'error' && hetaErrors.length > 0;
  if (createLog) {
    switch (settings.options.logFormat) {
      case 'json':
        var logs = JSON.stringify(c.defaultLogs, null, 2);
        break;
      default:
        logs = c.defaultLogs.map(function (x) {
          return "[".concat(x.level, "]\t").concat(x.msg);
        }).join('\n');
    }

    //fs.outputFileSync(_logPath, logs);
    self.resolveLocalFileSystemSyncURL(url).getFile(_logPath, {
      create: true
    }).createWriter().write(new Blob([logs], {
      type: "text/plain"
    }));
    c.logger.info("All logs was saved to file: \"".concat(_logPath, "\""));
  }
  if (!c.logger.hasErrors) {
    postMessage({
      action: 'finished',
      dist: _distDirname,
      logPath: _logPath
    });
  } else {
    postMessage({
      action: 'stop',
      logPath: _logPath
    });
  }

  // XXX: TEMP for testing
  //let entries = distDirectoryEntry?.createReader().readEntries();
  //console.log(entries);

  return c;
}
function _makeAndSave(exportItem, distDirectoryEntry) {
  var logger = exportItem._container.logger;
  var absPath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(distDirectoryEntry.fullPath, exportItem.filepath); // /dist/matlab
  var msg = "Exporting to \"".concat(absPath, "\" of format \"").concat(exportItem.format, "\"...");
  logger.info(msg);
  var mmm = exportItem.make();
  mmm.forEach(function (out) {
    try {
      var fileName = exportItem.filepath + out.pathSuffix;
      _writeFileDeep(distDirectoryEntry, fileName, new Blob([out.content]));
    } catch (e) {
      var _msg = "Heta compiler cannot export to file: \"".concat(fileName, "\": \n\t- ").concat(e.message);
      logger.error(_msg, {
        type: 'ExportError'
      });
    }
  });
}
function _writeFileDeep(directoryEntry, relPath, blob) {
  var relPathArray = relPath.split('/');
  var filename = relPathArray.pop();

  // create directory deep
  var currentEntry = directoryEntry;
  var _iterator = _createForOfIteratorHelper(relPathArray),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var x = _step.value;
      currentEntry = currentEntry.getDirectory(x, {
        create: true,
        exclusive: false
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  currentEntry.getFile(filename, {
    create: true,
    exclusive: true
  }).createWriter().write(blob);
}

/***/ }),

/***/ "?ed1b":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?d17e":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?d4c0":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_ajv_dist_ajv_js-node_modules_heta-compiler_src_webpack_js-node_modules_s-b458c9"], () => (__webpack_require__("./src/build.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + chunkId + "." + "cd6173c633cc367e553f" + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_build_js": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkheta_online"] = self["webpackChunkheta_online"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_ajv_dist_ajv_js-node_modules_heta-compiler_src_webpack_js-node_modules_s-b458c9").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=src_build_js.77c048f1edab8b26142d.js.map