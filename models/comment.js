const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: { type: String, required: true, minLength: 1, maxLength: 200 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  timestamp: { type: Date, default: moment(), require: true },
  likeCount: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

CommentSchema.virtual('date').get(function () {
  return moment(this.timestamp).fromNow();
});

module.exports = mongoose.model('Comment', CommentSchema);
