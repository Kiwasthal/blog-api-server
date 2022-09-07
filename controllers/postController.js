const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

exports.allPosts = async (req, res, next) => {
  try {
    let posts = await Post.find(
      {},
      { title: 1, content: 1, timestamp: 1, comments: 1 }
    ).populate('user', { username: 1, _id: 0 });

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(200).json({ message: 'No Posts' });
  }
};

exports.topPosts = async (req, res, next) => {
  try {
    let posts = await Post.find(
      {},
      { title: 1, content: 1, timestamp: 1, likeCount: 1, comments: 1 }
    )
      .sort([['likeCount', 'descending']])
      .limit(5)
      .populate('user', { username: 1, _id: 0 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(200).json({ message: 'No posts found' });
  }
};

exports.singePost = async (req, res, next) => {
  try {
    let post = await Post.find({ _id: req.params.postid }).populate('user', {
      username: 1,
    });

    if (!post || post.length == 0) {
      return res.status(404).json({ message: 'No post with id exists' });
    }
    return res.status(200).json({ post });
  } catch (err) {
    return res.json({ message: 'Post does not exist' });
  }
};

// Admin Only

exports.updatePost = async (req, res, next) => {
  try {
    if (req.user.admin) {
      let post = await Post.findByIdAndUpdate(req.params.postid, {
        title: req.body.title,
        content: req.body.content,
      });
      if (!post) {
        return res
          .status(404)
          .json({ err: `No posts with id ${req.params.postid} exists` });
      }
      res.status(200).json({
        message: `Post with id ${req.params.postid} updated`,
        post: post,
      });
    } else
      res
        .status(403)
        .json({ message: 'You must be an admin to update the post' });
  } catch (err) {
    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (req.user.admin) {
      let post = await Post.findByIdAndDelete({ _id: req.params.postid });
      if (!post) {
        return res
          .status(404)
          .json({ err: `No posts with id ${req.params.postid} exists` });
      }
      let deletedComments = await Comment.deleteMany({
        postId: req.params.postid,
      });
      res.status(200).json({
        message: `Post with id ${req.params.postid} deleted successfully`,
        comments: deletedComments,
      });
    } else {
      return res
        .status(403)
        .json({ message: 'You must be an admin to perform this action' });
    }
  } catch (err) {
    return next(err);
  }
};

exports.createPost = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Add title for your post'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Add content for your post'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        data: req.body,
      });
    }
    try {
      let post = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.user._id,
      });
      post.save(err => {
        if (err) return next(err);
        console.log('post saved');
        res.status(200).json({ post, token: req.user });
      });
      await User.findByIdAndUpdate(
        { _id: post.user },
        { $push: { posts: post } }
      );
    } catch (err) {
      res.status(400).json(err);
    }
  },
];
