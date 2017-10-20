// npm dependencies
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    /**
     * @description encrypting string
     * @example
        var encrypt = require('path/to/file.js').encrypt;
        var option = {
            salt: 10, // Number
            
        };
        encrypt('any string', {salt:10}).then().catch();
     * @param { String } value - to encript
     * @param { Object } options - to make hash
     * @returns { Promise }
     * @public
     */
    encrypt: function ( value, options ) {
        return new Promise(function ( resolve, reject ) {
            // generate a salt
            bcrypt.genSalt(options.salt, function ( error, salt ) {
                if ( error ) reject(error);
                else {
                    // hash (encrypt) PASSWORD using this SALT
                    bcrypt.hash(value, salt, null, function ( error, hash ) {
                        if ( error ) reject(error);
                        else resolve(hash);
                    });
                }
            });
        });
    },
    /**
     * @description compare encrypted string
     * @example
         var compare = require('path/to/file.js').compare;
         var option = {
             salt: 10, // Number
             
         };
         compare('candidate string', 'encrypted string').then().catch();
     * @param { String } candidate - string to caompare
     * @returns { Promise }
     * @function
     * @public
     */
    compare: function ( candidate, encrypted ) {
        return new Promise(function ( resolve, reject ) {
            // compare
            bcrypt.compare(candidate, encrypted, function ( error, result ) {
                if ( error ) reject(error);
                else resolve(result);
            });
        });
    },
};


