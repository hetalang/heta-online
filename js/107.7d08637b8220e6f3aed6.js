(()=>{var e,o,t={33155:(e,o,t)=>{var n=t(94402);e.exports=function(e){e.opts.autoescape=!1,n(e)}},74189:(e,o,t)=>{"use strict";var n=t(45770),r=t(91519),a=t.n(r),i=t(92629),s=t(29550),c=t.n(s),l=t(12883),u=t(85811),f=t.n(u),p=t(36694).lW;function g(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,o){if(!e)return;if("string"==typeof e)return d(e,o);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return d(e,o)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,o){(null==o||o>e.length)&&(o=e.length);for(var t=0,n=new Array(o);t<o;t++)n[t]=e[t];return n}new FileReaderSync;var v=new(c())({allErrors:!0,useDefaults:!0});v.addKeyword({keyword:"example",type:"string"});var m=v.compile(i),h='\n +-------------------------------------------------------------------+ \n | Internal "Heta compiler" error, contact the developers.           | \n | Create an issue: '.concat(l.bugs.url," | \n | or mail to: ").concat(l.bugs.email,"                                     | \n +-------------------------------------------------------------------+ \n");function y(e,o,t){var n=e._container.logger,r=a().resolve(o,e.filepath),i='Exporting to "'.concat(r,'" of format "').concat(e.format,'"...');n.info(i),e.make().forEach((function(e){var o=r+e.pathSuffix;try{t[o]=e.content}catch(e){var a='Heta compiler cannot export to file: "'.concat(o,'": \n\t- ').concat(e.message);n.error(a,{type:"ExportError"})}}))}self.onmessage=function(e){var o=e.data.files;postMessage({action:"console",value:"heta build"}),postMessage({action:"console",value:'\nRunning compilation with declaration file "/platform.json"...'});var t=o["/platform.json"],r=new TextDecoder("utf-8").decode(t);try{var i=JSON.parse(r)}catch(e){return postMessage({action:"console",value:"\nDeclaration file must be JSON formatted:"}),postMessage({action:"console",value:"\n\t- ".concat(e.message)}),void postMessage({action:"console",value:"\n\n$ "})}if(!m(i))return postMessage({action:"console",value:"\nErrors in declaration file:"}),m.errors.forEach((function(e){var o='\n\t- "'.concat(e.instancePath,'" ').concat(e.message);postMessage({action:"console",value:o})})),void postMessage({action:"console",value:"\n\n$ "});if(!f().satisfies(l.version,i.builderVersion))return postMessage({action:"console",value:"\nVersion requirements (".concat(i.builderVersion,") don't meet builder version ").concat(l.version,".")}),void postMessage({action:"console",value:"\n\n$ "});try{var s=function(e,o){var t="/",r=new n.Container;r.logger.addTransport((function(e,o,t,n){var r="\n[".concat(e,"]\t").concat(o);postMessage({action:"console",value:r})}));var i=a().resolve(t),s=a().resolve(t,o.options.distDir),c=a().resolve(t,o.options.metaDir),u=a().resolve(t,o.options.logPath);r.logger.info("Heta builder of version ".concat(l.version,' initialized in directory "').concat(i,'"')),o.id&&r.logger.info('Platform id: "'.concat(o.id,'"'));var f={};r.logger.info('Compilation of module "'.concat(o.importModule.source,'" of type "').concat(o.importModule.type,'"...'));var d=new n.ModuleSystem(r.logger,(function(o){var t=e[o];if(!t)throw new Error("Module ".concat(o," is not found."));return p.from(t)})),v=a().resolve(i,o.importModule.source),m=o.importModule.type;d.addModuleDeep(v,m,o.importModule),o.options.debug&&Object.getOwnPropertyNames(d.moduleCollection).forEach((function(e){var o=a().relative(i,e+".json"),t=a().join(c,o),n=JSON.stringify(d.moduleCollection[e],null,2);f[t]=p.from(n,"utf-8"),r.logger.info("Meta file was saved to ".concat(t))}));var h=d.integrate();if(r.loadMany(h,!1),r.logger.info("Setting references in elements, total length "+r.length),r.knitMany(),r.logger.info("Checking for circular references in Records."),r.checkCircRecord(),r.checkCircUnitDef(),r.logger.hasErrors)r.logger.warn("Units checking and export were skipped because of errors in compilation.");else if(o.options.unitsCheck?(r.logger.info("Checking unit's consistency."),r.checkUnits()):r.logger.warn('Units checking skipped. To turn it on set "unitsCheck: true" in declaration.'),r.logger.info("Checking unit's terms."),r.checkTerms(),o.options.skipExport)r.logger.warn("Exporting skipped as stated in declaration.");else if(o.options.juliaOnly){r.logger.warn('"Julia only" mode'),y(new(0,this.container.classes.Julia)({format:"Julia",filepath:"_julia"}),s,f)}else{var b=g(r.exportStorage).map((function(e){return e[1]}));r.logger.info("Start exporting to files, total: ".concat(b.length,".")),b.forEach((function(e){return y(e,s,f)}))}var w=r.hetaErrors();if("always"===o.options.logMode||"error"===o.options.logMode&&w.length>0){if("json"===o.options.logFormat)var M=JSON.stringify(r.defaultLogs,null,2);else M=r.defaultLogs.map((function(e){return"[".concat(e.level,"]\t").concat(e.msg)})).join("\n");f[u]=p.from(M,"utf-8"),r.logger.info('All logs was saved to file: "'.concat(u,'"'))}r.logger.hasErrors?postMessage({action:"stop",dict:f}):postMessage({action:"finished",dict:f});return r}(o,i)}catch(e){return postMessage({action:"console",value:h+"\n"}),postMessage({action:"console",value:e.stack}),void postMessage({action:"console",value:"\n\n$ "})}s.hetaErrors().length>0?postMessage({action:"console",value:"\nCompilation ERROR! See logs."}):postMessage({action:"console",value:"\nCompilation OK!"}),postMessage({action:"console",value:"\n\n$ "})}},75042:()=>{},69862:()=>{},40964:()=>{}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={id:e,loaded:!1,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}r.m=t,r.x=()=>{var e=r.O(void 0,[4,311],(()=>r(74189)));return e=r.O(e)},r.amdD=function(){throw new Error("define cannot be used indirect")},r.amdO={},e=[],r.O=(o,t,n,a)=>{if(!t){var i=1/0;for(u=0;u<e.length;u++){for(var[t,n,a]=e[u],s=!0,c=0;c<t.length;c++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](t[c])))?t.splice(c--,1):(s=!1,a<i&&(i=a));if(s){e.splice(u--,1);var l=n();void 0!==l&&(o=l)}}return o}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[t,n,a]},r.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return r.d(o,{a:o}),o},r.d=(e,o)=>{for(var t in o)r.o(o,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:o[t]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce(((o,t)=>(r.f[t](e,o),o)),[])),r.u=e=>"js/"+e+"."+{4:"67ba40941a58611822d7",311:"d268cf34d8a0c635f1d3"}[e]+".js",r.miniCssF=e=>{},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var o=r.g.document;if(!e&&o&&(o.currentScript&&(e=o.currentScript.src),!e)){var t=o.getElementsByTagName("script");if(t.length)for(var n=t.length-1;n>-1&&!e;)e=t[n--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e+"../"})(),(()=>{var e={107:1};r.f.i=(o,t)=>{e[o]||importScripts(r.p+r.u(o))};var o=self.webpackChunkheta_online=self.webpackChunkheta_online||[],t=o.push.bind(o);o.push=o=>{var[n,a,i]=o;for(var s in a)r.o(a,s)&&(r.m[s]=a[s]);for(i&&i(r);n.length;)e[n.pop()]=1;t(o)}})(),o=r.x,r.x=()=>Promise.all([r.e(4),r.e(311)]).then(o);r.x()})();
//# sourceMappingURL=107.7d08637b8220e6f3aed6.js.map