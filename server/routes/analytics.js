const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/analytics/dau
// @desc    Daily Active Users (users who posted today)
router.get('/dau', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dau = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$author',
        }
      },
      {
        $count: 'activeUsers'
      }
    ]);

    res.json({ dau: dau[0]?.activeUsers || 0, date: today });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/mau
// @desc    Monthly Active Users
router.get('/mau', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mau = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$author'
        }
      },
      {
        $count: 'activeUsers'
      }
    ]);

    res.json({ mau: mau[0]?.activeUsers || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/engagement
// @desc    Engagement metrics (likes, comments per post)
router.get('/engagement', async (req, res) => {
  try {
    const engagementStats = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          avgLikes: { $avg: '$likes' },
          avgComments: { $avg: '$comments' }
        }
      }
    ]);

    res.json(engagementStats[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/posts-by-day
// @desc    Posts count per day (last 7 days)
router.get('/posts-by-day', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const postsByDay = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(postsByDay);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/top-users
// @desc    Top 10 users by post count
router.get('/top-users', async (req, res) => {
  try {
    const topUsers = await Post.aggregate([
      {
        $group: {
          _id: '$author',
          authorName: { $first: '$authorName' },
          postCount: { $sum: 1 },
          totalLikes: { $sum: '$likes' }
        }
      },
      {
        $sort: { postCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/export
// @desc    Export all analytics data for Power BI
router.get('/export', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
