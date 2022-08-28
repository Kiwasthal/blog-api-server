const Post = require('../models/post');
const Users = require('../models/user');
const Comment = require('../models/comment');

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
      { title: 1, content: 1, timeStamp: 1, likeCount: 1, comments: 1 }
    )
      .sort([['likeCount', 'descending']])
      .limit(10)
      .populate('user', { username: 1, _id: 0 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(200).json({ message: 'No posts found' });
  }
};

exports.singePost = async (req, res, next) => {
  try {
    let post = await Post.find({ _id: req.params.postid }).populate('author', {
      username: 1,
    });

    if (!post || post.length === 0)
      return res.status(404).json({ message: 'Could not find post' });
    return res.status(200).json({ post });
  } catch (err) {
    return res.json({ message: 'Post does not exist' });
  }
};

// Admin Only
