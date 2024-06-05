import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from "./models/User"
import bcrypt from "bcryptjs"
import process from "node:process";

const localStrategy = new LocalStrategy((username, password, done) => {
    User.findOne({
        username: username
    }).lean().exec().then((user) => {
        if (!user) {
            return done(null, false, { message: 'Username or password are incorrect.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            
            if (isMatch) {
                return done(null, user);
            }

            return done(null, false, { message: 'Username or password are incorrect.' });
            
        });
    });
});

passport.use(localStrategy);
  
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, {
        id: user._id,
        username: user.username,
        email: user.email,
    });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

export default passport;