const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const User = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTstrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const verifyCb = (username, password, done) => {
  User.findOne({ username }).exec((err, user) => {
    if (err) return done(err);
    if (!user)
      return done(null, false, {
        message: 'Username does not exist',
      });
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      else return done(null, false, { message: 'Incorrect Password' });
    });
  });
};

const strategy = new LocalStategy(verifyCb);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId).exec((err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

passport.use(
  new JWTstrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (token, done) => {
      try {
        console.log(token);
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
