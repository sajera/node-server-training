// alias
var UserModel;

// npm dependencies
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// local dependencies
var Schema = mongoose.Schema;

// configuration Model (data in table)
var userSchema = new Schema({
    name: String,
    password: String,
    email: { type: String, unique: true, lowercase: true },
});

// // On save Hook encrypt password
// // Run before saving a model
// userSchema.pre('save', function ( next ) {
//     // get access to the user model
//     var user = this;
//     // user encrypt password
//     encrypt(user.password, 10)
//         .then(function ( success ) {
//             // overwrite plain text password with encrypted password
//             user.password = success;
//             // 
//             process.env.DEBUG&&
//             console.log('UserModel encrypt: "PASSWORD"', user);
//             // go to next action presumably SAVE
//             next();
//         })
//         .catch(next.bind(null));
// 
// });
// 
// // method ot compare password of user
// userSchema.methods.comparePassword = function ( candidatePassword, next ) {
//     bcrypt.compare(candidatePassword, this.password, function ( error, result ) {
//         if ( error ) return next(error, null);
//         else  return next(null, result); 
//     });
// }


// Create the model class and Exprots it
module.exports = UserModel = mongoose.model('user', userSchema);

/*-------------------------------------------------
        PRIVAT
---------------------------------------------------*/
// /**
//  * @description encrypting string
//  * @example encrypt('password', 10).then().catch();
//  * @param { String } value - to encript
//  * @param { Number } salt - to make hash
//  * @returns { Promise }
//  * @private
//  */
// function encrypt ( value, salt ) {
//     return new Promise(function ( resolve, reject ) {
//         // generate a salt
//         bcrypt.genSalt(salt, function ( error, salt ) {
//             if ( error ) reject(error);
//             else {
//                 // hash (encrypt) PASSWORD using this SALT
//                 bcrypt.hash(value, salt, null, function ( error, hash ) {
//                     if ( error ) reject(error);
//                     else resolve(hash);
//                 });
//             }
//         });
//     });
// }