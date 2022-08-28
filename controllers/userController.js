const User = require('../models/user');

exports.userProfile = async (req, res, next) => {
  return res.status(200).json({ message: `hello ${req.user.username}` });
};

exports.allUsers = async (req, res, next) => {
  try {
    let users = await User.find({}, { username: 1 });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({ message: 'No users yet' });
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    let user = await User.find({ _id: req.params.userid }, { username: 1 });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: 'No User with that Id' });
  }
};

exports.userPosts = async (req, res, next) => {
  try {
    let postsMade = await User.find(
      { _id: req.params.userid },
      { _id: 0, posts: 1 }
    );
    res.status(200).json({ postsMade });
  } catch (err) {
    return res.status(400).json({ message: 'no posts made yet' });
  }
};
