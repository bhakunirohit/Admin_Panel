const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy

passport.use(new facebookStrategy({
 
    // pull in our app id and secret from our auth.js file
    clientID        : "231963506152247",
    clientSecret    : "a020aebbb297cff69ffb57fa43b8527b",
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
 
},
// returns 4 params where done is callback
function(token, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
 }));

 passport.serializeUser(function(user, done) {
    done(null, user.id);
});
 
// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});