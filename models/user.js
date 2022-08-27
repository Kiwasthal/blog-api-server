const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config;

let Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 20 },
  password: { type: String, required: true, maxLength: 20, minLenght: 6 },
  admin: { type: Boolean, default: false },
  member: { type: Boolean, default: false },
  timeStamp: { type: Date, default: Date.now, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function (candidPass, cb) {
  bcrypt.compare(candidPass, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
