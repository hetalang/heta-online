// NOT USED
// this can be removed for futute versions of heta-compiler
let xxx = require('heta-compiler/src/nunjucks-env');

module.exports = function(env){
    env.opts.autoescape = false;
    xxx(env);
}