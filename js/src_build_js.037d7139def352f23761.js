/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/build.js":
/*!**********************!*\
  !*** ./src/build.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! heta-compiler/src/webpack */ \"./node_modules/heta-compiler/src/webpack.js\");\n/* harmony import */ var heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"./node_modules/path-browserify/index.js\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var heta_compiler_src_builder_declaration_schema_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! heta-compiler/src/builder/declaration-schema.json */ \"./node_modules/heta-compiler/src/builder/declaration-schema.json\");\n/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ajv */ \"./node_modules/ajv/dist/ajv.js\");\n/* harmony import */ var ajv__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ajv__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! heta-compiler/package.json */ \"./node_modules/heta-compiler/package.json\");\n/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! semver */ \"./node_modules/semver/index.js\");\n/* harmony import */ var semver__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(semver__WEBPACK_IMPORTED_MODULE_5__);\n/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ \"./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js\")[\"Buffer\"];\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== \"undefined\" && o[Symbol.iterator] || o[\"@@iterator\"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n\n\n\n\n//const ajvErrors = require('ajv-errors');\n\n\nself.requestFileSystemSync = self.webkitRequestFileSystemSync || self.requestFileSystemSync;\nself.resolveLocalFileSystemSyncURL = self.webkitResolveLocalFileSystemSyncURL || self.resolveLocalFileSystemSyncURL;\nvar reader = new FileReaderSync();\nvar ajv = new (ajv__WEBPACK_IMPORTED_MODULE_3___default())({\n  allErrors: true,\n  useDefaults: true\n});\najv.addKeyword({\n  keyword: \"example\",\n  type: \"string\"\n});\n//ajvErrors(ajv, {singleError: false}); // this is required for custom messages see https://ajv.js.org/packages/ajv-errors.html\nvar validate = ajv.compile(heta_compiler_src_builder_declaration_schema_json__WEBPACK_IMPORTED_MODULE_2__);\nvar contactMessage = \"\\n +-------------------------------------------------------------------+ \\n | Internal \\\"Heta compiler\\\" error, contact the developers.           | \\n | Create an issue: \".concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.bugs.url, \" | \\n | or mail to: \").concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.bugs.email, \"                                     | \\n +-------------------------------------------------------------------+ \\n\");\nself.onmessage = function (evt) {\n  // first lines in console\n  postMessage({\n    action: 'console',\n    value: 'heta build',\n    append: true\n  });\n  postMessage({\n    action: 'console',\n    value: '\\nRunning compilation with declaration file \"/platform.json\"...',\n    append: true\n  });\n\n  // create declaration\n  var declarationFile = self.resolveLocalFileSystemSyncURL(evt.data.url + '/platform.json').file();\n  var declarationText = reader.readAsText(declarationFile);\n  try {\n    var declaration = JSON.parse(declarationText);\n  } catch (e) {\n    postMessage({\n      action: 'console',\n      value: \"\\nDeclaration file must be JSON formatted:\",\n      append: true\n    });\n    postMessage({\n      action: 'console',\n      value: \"\\n\\t- \".concat(e.message),\n      append: true\n    });\n    postMessage({\n      action: 'console',\n      value: '\\n\\n$ ',\n      append: true\n    });\n    return;\n  }\n\n  // validate and set defaults\n  var valid = validate(declaration);\n  if (!valid) {\n    // analyze errors\n    postMessage({\n      action: 'console',\n      value: '\\nErrors in declaration file:',\n      append: true\n    });\n    validate.errors.forEach(function (ajvError) {\n      var msg = \"\\n\\t- \\\"\".concat(ajvError.instancePath, \"\\\" \").concat(ajvError.message);\n      postMessage({\n        action: 'console',\n        value: msg,\n        append: true\n      });\n    });\n    postMessage({\n      action: 'console',\n      value: '\\n\\n$ ',\n      append: true\n    });\n    return;\n  }\n\n  // === wrong version throws, if no version stated than skip ===\n  var satisfiesVersion = semver__WEBPACK_IMPORTED_MODULE_5___default().satisfies(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, declaration.builderVersion);\n  if (!satisfiesVersion) {\n    postMessage({\n      action: 'console',\n      value: \"\\nVersion requirements (\".concat(declaration.builderVersion, \") don't meet builder version \").concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, \".\"),\n      append: true\n    });\n    postMessage({\n      action: 'console',\n      value: '\\n\\n$ ',\n      append: true\n    });\n    return;\n  }\n\n  // === this part displays \"send errors to developer\" message ===\n  try {\n    var container = build(evt.data.url, declaration);\n  } catch (error) {\n    postMessage({\n      action: 'console',\n      value: contactMessage + '\\n',\n      append: true\n    });\n    postMessage({\n      action: 'console',\n      value: error.stack,\n      append: true\n    });\n    postMessage({\n      action: 'console',\n      value: '\\n\\n$ ',\n      append: true\n    });\n    return;\n  }\n  if (container.hetaErrors().length > 0) {\n    postMessage({\n      action: 'console',\n      value: '\\nCompilation ERROR! See logs.',\n      append: true\n    });\n  } else {\n    postMessage({\n      action: 'console',\n      value: '\\nCompilation OK!',\n      append: true\n    });\n  }\n  postMessage({\n    action: 'console',\n    value: '\\n\\n$ ',\n    append: true\n  });\n};\nfunction build(url, settings) {\n  // modules, exports\n  var coreDirname = '/';\n  /*\n      constructor()\n  */\n\n  // create container and logger\n  var c = new heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__.Container();\n  /*\n  c.logger.addTransport((level, msg, opt, levelNum) => { // temporal solution, all logs to console\n      console.log(`{heta-compiler} [${level}]\\t${msg}`);\n  });\n  */\n  c.logger.addTransport(function (level, msg, opt, levelNum) {\n    var value = \"\\n[\".concat(level, \"]\\t\").concat(msg);\n    postMessage({\n      action: 'console',\n      value: value,\n      append: true\n    });\n  });\n\n  // file paths\n  var _coreDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname);\n  var _distDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.distDir);\n  var _metaDirname = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.metaDir);\n  var _logPath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(coreDirname, settings.options.logPath);\n  c.logger.info(\"Heta builder of version \".concat(heta_compiler_package_json__WEBPACK_IMPORTED_MODULE_4__.version, \" initialized in directory \\\"\").concat(_coreDirname, \"\\\"\"));\n  if (settings.id) c.logger.info(\"Platform id: \\\"\".concat(settings.id, \"\\\"\"));\n\n  /*\n      run()\n  */\n  c.logger.info(\"Compilation of module \\\"\".concat(settings.importModule.source, \"\\\" of type \\\"\").concat(settings.importModule.type, \"\\\"...\"));\n\n  // 1. Parsing\n  var ms = new heta_compiler_src_webpack__WEBPACK_IMPORTED_MODULE_0__.ModuleSystem(c.logger, function (filename) {\n    try {\n      var file = self.resolveLocalFileSystemSyncURL(url + filename).file();\n      var arrayBuffer = reader.readAsArrayBuffer(file);\n    } catch (e) {\n      throw new Error(\"File \".concat(filename, \" is not found.\"));\n    }\n    return Buffer.from(arrayBuffer);\n  });\n  var absFilename = path__WEBPACK_IMPORTED_MODULE_1___default().join(_coreDirname, settings.importModule.source);\n  var sourceType = settings.importModule.type;\n  ms.addModuleDeep(absFilename, sourceType, settings.importModule);\n\n  // 2. Modules integration\n  if (settings.options.debug) {\n    Object.values(ms.moduleCollection).forEach(function (value) {\n      var relPath = path__WEBPACK_IMPORTED_MODULE_1___default().relative(_coreDirname, value.filename + '.json');\n      var absPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(_metaDirname, relPath);\n      var str = JSON.stringify(value.parsed, null, 2);\n      fs.outputFileSync(absPath, str);\n      c.logger.info(\"Meta file was saved to \".concat(absPath));\n    });\n  }\n  var qArr = ms.integrate();\n\n  // 3. Translation\n  c.loadMany(qArr, false);\n\n  // 4. Binding\n  c.logger.info('Setting references in elements, total length ' + c.length);\n  c.knitMany();\n\n  // 5. Circular start_ and ode_\n  c.logger.info('Checking for circular references in Records.');\n  c.checkCircRecord();\n\n  // 6. check circ UnitDef\n  c.checkCircUnitDef();\n\n  // === STOP if errors ===\n  if (!c.logger.hasErrors) {\n    // 7. Units checking\n    if (settings.options.unitsCheck) {\n      c.logger.info('Checking unit\\'s consistency.');\n      c.checkUnits();\n    } else {\n      c.logger.warn('Units checking skipped. To turn it on set \"unitsCheck: true\" in declaration.');\n    }\n\n    // 8. Terms checking\n    c.logger.info('Checking unit\\'s terms.');\n    c.checkTerms();\n\n    // 9. Exports\n    // create dist dir\n    var distDirectoryEntry = self.resolveLocalFileSystemSyncURL(url).getDirectory(_distDirname, {\n      create: true\n    });\n    // save\n    if (settings.options.skipExport) {\n      c.logger.warn('Exporting skipped as stated in declaration.');\n    } else if (settings.options.juliaOnly) {\n      c.logger.warn('\"Julia only\" mode');\n      //this.exportJuliaOnly(); \n      // create export without putting it to exportStorage\n      var Julia = this.container.classes['Julia'];\n      var exportItem = new Julia({\n        format: 'Julia',\n        filepath: '_julia'\n      });\n      _makeAndSave(exportItem, distDirectoryEntry);\n    } else {\n      //this.exportMany();\n      var exportElements = _toConsumableArray(c.exportStorage).map(function (x) {\n        return x[1];\n      });\n      c.logger.info(\"Start exporting to files, total: \".concat(exportElements.length, \".\"));\n      exportElements.forEach(function (exportItem) {\n        return _makeAndSave(exportItem, distDirectoryEntry);\n      });\n    }\n  } else {\n    c.logger.warn('Units checking and export were skipped because of errors in compilation.');\n  }\n\n  // 10. save logs if required\n  var hetaErrors = c.hetaErrors();\n  var createLog = settings.options.logMode === 'always' || settings.options.logMode === 'error' && hetaErrors.length > 0;\n  if (createLog) {\n    switch (settings.options.logFormat) {\n      case 'json':\n        var logs = JSON.stringify(c.defaultLogs, null, 2);\n        break;\n      default:\n        logs = c.defaultLogs.map(function (x) {\n          return \"[\".concat(x.level, \"]\\t\").concat(x.msg);\n        }).join('\\n');\n    }\n\n    //fs.outputFileSync(_logPath, logs);\n    self.resolveLocalFileSystemSyncURL(url).getFile(_logPath, {\n      create: true\n    }).createWriter().write(new Blob([logs], {\n      type: \"text/plain\"\n    }));\n    c.logger.info(\"All logs was saved to file: \\\"\".concat(_logPath, \"\\\"\"));\n  }\n  if (!c.logger.hasErrors) {\n    postMessage({\n      action: 'finished',\n      dist: _distDirname,\n      logPath: _logPath\n    });\n  } else {\n    postMessage({\n      action: 'stop',\n      logPath: _logPath\n    });\n  }\n\n  // XXX: TEMP for testing\n  //let entries = distDirectoryEntry?.createReader().readEntries();\n  //console.log(entries);\n\n  return c;\n}\nfunction _makeAndSave(exportItem, distDirectoryEntry) {\n  var logger = exportItem._container.logger;\n  var absPath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(distDirectoryEntry.fullPath, exportItem.filepath); // /dist/matlab\n  var msg = \"Exporting to \\\"\".concat(absPath, \"\\\" of format \\\"\").concat(exportItem.format, \"\\\"...\");\n  logger.info(msg);\n  var mmm = exportItem.make();\n  mmm.forEach(function (out) {\n    try {\n      var fileName = exportItem.filepath + out.pathSuffix;\n      _writeFileDeep(distDirectoryEntry, fileName, new Blob([out.content]));\n    } catch (e) {\n      var _msg = \"Heta compiler cannot export to file: \\\"\".concat(fileName, \"\\\": \\n\\t- \").concat(e.message);\n      logger.error(_msg, {\n        type: 'ExportError'\n      });\n    }\n  });\n}\nfunction _writeFileDeep(directoryEntry, relPath, blob) {\n  var relPathArray = relPath.split('/');\n  var filename = relPathArray.pop();\n\n  // create directory deep\n  var currentEntry = directoryEntry;\n  var _iterator = _createForOfIteratorHelper(relPathArray),\n    _step;\n  try {\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var x = _step.value;\n      currentEntry = currentEntry.getDirectory(x, {\n        create: true,\n        exclusive: false\n      });\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n  currentEntry.getFile(filename, {\n    create: true,\n    exclusive: true\n  }).createWriter().write(blob);\n}\n\n//# sourceURL=webpack://heta-online/./src/build.js?");

/***/ }),

/***/ "?ed1b":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://heta-online/util_(ignored)?");

/***/ }),

/***/ "?d17e":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://heta-online/util_(ignored)?");

/***/ }),

/***/ "?d4c0":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://heta-online/crypto_(ignored)?");

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
/******/ 			return "js/" + chunkId + "." + "0632df003546fde3b7e1" + ".js";
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
/******/ 	return __webpack_exports__;
/******/ })()
;
});