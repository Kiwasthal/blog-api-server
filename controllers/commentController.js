const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

exports.commentsOfPost = async (req, res, next) => {
  try {
    let comments = await Comment.find({ postId: req.params.postid }).populate(
      'user',
      { username: 1 }
    );
    return res.status(200).json(comments);
  } catch (err) {
    return next(err);
  }
};

exports.allComments = async (req, res, next) => {
  try {
    let comments = await Comment.find({});
    if (!comments)
      return res.status(404).json({ message: 'No comments created yet' });
    return res.status(200).json({ comments });
  } catch (err) {
    return next(err);
  }
};

exports.commentInstance = async (req, res, next) => {
  try {
    let comment = await Comment.find({ _id: req.params.commentid });
    if (!comment)
      return res
        .status(404)
        .json({ message: `No commend with id ${req.params.commentid}` });
    return res.status(200).json({ comment });
  } catch (err) {
    return next(err);
  }
};

exports.createComment = [
  body('comment')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please add content to your comment'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    try {
      const comment = new Comment({
        comment: req.body.comment,
        user: req.user._id,
        postId: req.params.postid,
      });
      comment.save(err => {
        if (err) res.status(400).json({ err });
        res.status(200).json({ message: 'Comment added', comment });
      });
      await Post.findByIdAndUpdate(
        { _id: req.params.postid },
        { $push: { comments: comment } }
      );
    } catch (err) {
      return res.status(400).json({ err });
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    if (req.user.admin) {
      let comment = await Comment.findByIdAndDelete({
        _id: req.params.commentid,
      });
      if (!comment)
        return res.status(400).json({
          message: `No comment matching id : ${req.params.commentid}`,
        });
      else {
        let commentToDelete = await Post.findOneAndUpdate(
          {
            _id: req.params.postid,
          },
          {
            $pull: {
              comments: req.params.commentid,
            },
          }
        );
        return res.status(200).json({
          message: `Comment matching id ${req.params.commentid} deleted and removed from post : ${req.params.postid}`,
          comment,
          commentToDelete,
        });
      }
    }
    return res
      .status(403)
      .json({ message: 'You need admin rights to delete this comment' });
  } catch (err) {
    return next(err);
  }
};
