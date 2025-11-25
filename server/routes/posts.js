const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// @route   POST /api/posts
// @desc    Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const newPost = new Post({
      content,
      author: req.user.id,
      authorName: req.user.username
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like a post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (post.likedBy.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes += 1;
    post.likedBy.push(req.user.id);
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
