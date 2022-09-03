const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        let error = new Error('User does not exist');
        return res.status(403).json({ info });
      }
      req.login(user, { session: false }, err => {
        if (err) return next(err);

        const body = {
          _id: user._id,
          username: user.username,
          admin: user.admin,
        };
        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
          expiresIn: '1d',
        });

        return res.status(200).json({ body, token });
      });
    })(req, res, next);
  } catch (err) {
    res.status(403).json({ err });
  }
};

exports.register = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .custom(async username => {
      try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) throw new Error('Username already exists');
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      admin: false,
      member: true,
    });
    user.save(err => {
      if (err) return next(err);
      res.status(200).json({
        message: 'User successfully created',
      });
    });
  },
];

// exports.adminregister = (req, res, next) => {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.password,
//     admin: true,
//     member: true,
//   });
//   user.save(err => {
//     if (err) return next(err);
//     res.status(200).json({
//       message: 'User successfully created',
//     });
//   });
// };
