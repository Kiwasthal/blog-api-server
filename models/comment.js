const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: { type: String, required: true, minLength: 1, maxLength: 200 },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  timestamp: { type: Date, default: moment(), require: true },
});

CommentSchema.virtual('date').get(function () {
  return moment(this.timestamp).fromNow();
});

module.exports = mongoose.model('Comment', CommentSchema);
