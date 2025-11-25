import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, 
  TextField, Button, Alert, Grid, Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const PostList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) {
      setError('Post cannot be empty');
      return;
    }

    if (newPost.length > 280) {
      setError('Post exceeds 280 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/posts',
        { content: newPost },
        { headers: { 'x-auth-token': token } }
      );

      setNewPost('');
      setSuccess('Post created successfully!');
      setError('');
      fetchPosts();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Feed
      </Typography>

      {/* Create Post Card */}
      <Card sx={{ mb: 3, backgroundColor: '#fff' }}>
        <CardContent>
          <form onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 280 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {newPost.length}/280 characters
              </Typography>
              
              <Button 
                type="submit" 
                variant="contained" 
                endIcon={<SendIcon />}
                disabled={!newPost.trim()}
              >
                Post
              </Button>
            </Box>
          </form>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </CardContent>
      </Card>

      {/* Posts List */}
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {post.authorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={`${post.likes} likes`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleLike(post._id)}
                    color={post.likedBy?.includes(user?.id) ? 'error' : 'default'}
                  >
                    {post.likedBy?.includes(user?.id) ? 
                      <FavoriteIcon /> : 
                      <FavoriteBorderIcon />
                    }
                  </IconButton>
                  
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {posts.length === 0 && (
        <Alert severity="info">
          No posts yet. Be the first to post something!
        </Alert>
      )}
    </Box>
  );
};

export default PostList;
