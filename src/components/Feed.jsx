import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';
import { api } from '../services/api';
import Post from './Post';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersData = await api.getUsers();
      const usersMap = {};
      usersData.users.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);

      const allPosts = [];
      for (const user of usersData.users) {
        const userPosts = await api.getUserPosts(user.id);
        allPosts.push(...userPosts.posts.map(post => ({
          ...post,
          user: usersMap[post.userId]
        })));
      }

      allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(allPosts);
    } catch (error) {
      setError('Failed to load feed');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {posts.map(post => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Feed; 