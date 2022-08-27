const mongoose = require('mongoose');
const moment = require('moment');

let Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  content: { type: String, required: true, minLength: 1 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  timestamp: { type: Date, default: moment(), required: true },
  published: { type: Boolean, default: false },
});

PostSchema.virtual('url').get(function () {
  return '/posts/' + this.id;
});

PostSchema.virtual('date').get(function () {
  return moment(this.timestamp).fromNow();
});

module.exports = mongoose.model('Post', PostSchema);
