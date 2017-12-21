
var is = require('s-is');
var chalk = require('chalk');
var prefixStyle = chalk.bold.yellow;
var titleStyle = chalk.bold.bgBlue.black;
var itemHeaderStyle = chalk.italic.bgWhite.black;
var itemStyle = chalk.dim;
// var inverse = chalk.inverse;
// 
// var dim = chalk.dim;
// var bold = chalk.bold;
// var italic = chalk.italic;
// var underline = chalk.underline;
// var strikethrough = chalk.strikethrough;
// 
// var red = chalk.red;
// var blue = chalk.blue;
// var cyan = chalk.cyan;
// var black = chalk.black;
// var white = chalk.white;
// var green = chalk.green;
// var yellow = chalk.yellow;
// var magenta = chalk.magenta;
// 
// var bgRed = chalk.bgRed;
// var bgBlue = chalk.bgBlue;
// var bgCyan = chalk.bgCyan;
// var bgBlack = chalk.bgBlack;
// var bgWhite = chalk.bgWhite;
// var bgGreen = chalk.bgGreen;
// var bgYellow = chalk.bgYellow;
// var bgMagenta = chalk.bgMagenta;

log.DEBUG = Boolean( (process.env||{}).DEBUG );
log.SHORT = true;
log('debug mode was enabled', { DEBUG: log.DEBUG, SHORT: log.SHORT });

/**
 * @exports log
 */
module.exports = log;
/**
 * @description
 * @param { String } 
 * @returns { Object, Array }
 * @function log
 * @public
 */
function log ( title, data ) {
    if ( !log.DEBUG ) return; // work only in debug mod
    console.log( prefixStyle('[DEBUG]:'), titleStyle(title) );
    switch ( is.typeof(data) ) {
        case 'undefined': // without log 
        break;case 'object': for ( var key in data )
            console.log(itemHeaderStyle('-- '+key+':'), log.SHORT ? itemStyle(String(data[key])) : data[key] );
        break;case 'array': for ( var key = 0; key < data.length; key ++ )
            console.log(itemHeaderStyle('-- '+key+':'), log.SHORT ? itemStyle(String(data[key])) : data[key] );
        break;default: console.log( itemStyle(data) );
    }
}

