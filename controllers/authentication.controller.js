// alias
var Auth;
// npm dependencies
var jwt = require('jwt-simple');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var passportJwt = require('passport-jwt');
var StrategyLocal = require('passport-local');

// local dependencies
var User = require('../models/User.model.js');
var StrategyJwt = passportJwt.Strategy;
var ExtractJwt = passportJwt.ExtractJwt;

// configuration
var config = require('../environment/config.js');
var optionJwt = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
};
var optionLocal = {
    usernameField: 'email',
};

// passport use JWT tokenization strategy
passport.use( new StrategyJwt(optionJwt,
/**
 * @description worker to determine and restore user from session
 * @param { Object } payload - decrypted user authentification data
 * @param { Function } next - callback
 * @private
 */
function ( payload, next ) {
    // 
    process.env.DEBUG&&
    console.log('StrategyJwt handler:\n', payload);
    // try to find user by ID in DB
    User.findById(payload.sub, function ( error, user ) {
        // error
        if ( error ) return next( error, null );
        // does not find the user
        else if ( !user ) return  next( null, null );
        // user restored from token
        else return next( null, user );
    });
}) );

// strategy to for storyng session on the fly
passport.use( new StrategyLocal(optionLocal,
/**
 * @description worker to determine user from DB by "email" and "password"
 * @param { String } email - decrypted user authentification email
 * @param { String } password - decrypted user authentification password
 * @param { Function } next - callback
 * @private
 */
function ( email, password, next ) {
    // 
    process.env.DEBUG&&
    console.log('StrategyLocal handler:\n', email, password);
    // try to find user by ID in DB
    User.findOne({
        email: email,
    }, function ( error, user ) {
        // error
        if ( error ) return next( error, null );
        // success of comparing user.password (in hash) and received password (it not a hash)
        if ( user && bcrypt.compareSync( password, user.password ) ) return  next( null, user );
        // else
        return next( null, null );
    });
}) );

/*-------------------------------------------------
        PRIVAT
---------------------------------------------------*/
// /**
//  * @description worker to determine and restore user from session
//  * @param { Object } payload - decrypted user authentification data
//  * @param { Function } next - callback
//  * @function
//  * @private
//  */
// function restoreUserFromToken ( payload, next ) {
//     console.log('restoreUserFromToken', User);
//     // try to find user by ID in DB
//     User.findById(payload.sub, function ( error, user ) {
//         if ( error ) return next( error, null );
//         else if ( !user ) return  next( null, null );
//         else {
//             return  next( null, user );
//         }
//     });
// }
// 
// /**
//  * @description worker to determine and restore user from session
//  * @param { String } email - decrypted user authentification email
//  * @param { String } password - decrypted user authentification password
//  * @param { Function } next - callback
//  * @function
//  * @private
//  */
// function restoreUserFromToken ( email, password, next ) {
//     console.log('restoreUserFromToken', User);
//     // try to find user by ID in DB
//     User.findOne({
//         email: email,
//         // compare password (password is encoded)
//         password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
//     }, function ( error, user ) {
//         if ( error ) return next( error, null );
//         else if ( !user ) return  next( null, null );
//         else return  next( null, user );
//     });
// }

/**
* @description exports Authenticate controllers
* @returns { Object } authentication
* @public
*/
module.exports = Auth = {
    /**
     * @description controller method to
     * @function Auth.requireAuth
     * @public
     */
    getUserByToken: passport.authenticate('jwt', { session: false }),
    
    /**
     * @description controller method to
     * @function Auth.sessionAuth
     * @public
     */
    getUserByCredential: passport.authenticate('local', { session: false }),
    
    /**
    * @description Sign Up controller 
    * @function Auth.signup
    * @public
    */
    signup: function signup ( request, response, next ) {
        // 
        process.env.DEBUG&&
        console.log('signup:', request.body );
        
        var email = request.body.email;
        var password = request.body.password;
        // 
        if ( !email || !password ) {
            return response.status(422).send({ error: 'You must provide email and password' });
        }
        
        // Check uniques of user email
        User.findOne({ email: email }, function ( error, users ) {
            // if request is fail
            if ( error ) {
                return next(err);
            // if user email exist
            } else if ( users  ) {
                // Respond error
                return response.status(422).send({ error: 'Email is in use' });
            // if user email NOT exist
            } else {
                // Create new user
                var user = new User({
                    name: email,
                    email: email,
                    // encript password sync 
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                });
                // Save user to DB
                user.save(function ( error ) {
                    // if request is fail
                    if ( error ) {
                        return next(error);
                    }
                    
                    // Respond user data
                    return response.send({
                        access_token: token(user, 2),
                        refresh_token: token(user, 48)
                    });
                });
            }
        });
    },
    
    /**
    * @description Sign In controller 
    * @function Auth.signin
    * @public
    */
    signin: function signup ( request, response, next ) {
        // 
        process.env.DEBUG&&
        console.log('signin:', request.body );
        
        response.send({
            access_token: token(request.user, 2),
            refresh_token: token(request.user, 48),
        });

    },
};

/*-------------------------------------------------

        PRIVAT methods

---------------------------------------------------*/
/**
 * @description generate token for user to provide session
 * @example token(user, 1)
 * @param { Object } user instance
 * @param { Number } expiration time in hourse
 * @returns { String }
 * @function token
 * @private
 */
function token ( user, expiration ) {
    var date = new Date();
    date.setDate( date.getHours() + expiration||0 );
    return jwt.encode({
        sub: user.id, // for who we generate this token
        iat: date.getTime(),
    }, config.secret);
}

