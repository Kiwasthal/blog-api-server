const express = require('express');
const router = express.Router();
const passport = require('passport');

const auth_Controller = require('../controllers/authController');
const post_Controller = require('../controllers/postController');
const comment_Controller = require('../controllers/commentController');
const user_Controller = require('../controllers/userController');

// --- Client Routers

router.post('/login', auth_Controller.login);

router.post('/register', auth_Controller.register);

router.post('/logout');

router.get('/posts', post_Controller.allPosts);

router.get('/posts/top', post_Controller.topPosts);

router.get('/posts/:postid', post_Controller.singePost);

router.get('/posts/:postid/comments', comment_Controller.commentsOfPost);

// Auth Routes

// --- Posts

router.put(
  '/posts/:postid/update',
  passport.authenticate('jwt', { session: false }),
  post_Controller.updatePost
);

router.delete(
  'posts/:postid',
  passport.authenticate('jwt', { session: false }),
  post_Controller.deletePost
);

router.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  post_Controller.createPost
);

// --- Comments

router.post(
  '/posts/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  comment_Controller.createComment
);

router.delete(
  '/posts/:postid/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_Controller.deleteComment
);

router.get(
  '/comments',
  passport.authenticate('jwt', { session: false }),
  comment_Controller.allComments
);

router.get(
  '/comments',
  passport.authenticate('jwt', { session: false }),
  comment_Controller.commentInstance
);

// --- Users

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  user_Controller.allUsers
);

router.get(
  '/users/:userid',
  passport.authenticate('jwt', { session: false }),
  user_Controller.userProfile
);

router.get(
  'users/:userid/posts',
  passport.authenticate('jwt', { session: false }),
  user_Controller.userPosts
);

// router.post('/admin', auth_Controller.adminregister);

module.exports = router;
