import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { api } from '../services/api';
import Post from './Post';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMorePosts);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      const usersData = await api.getUsers();
      const usersMap = {};
      usersData.users.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);

      const postsData = await fetchPosts(1);
      setPosts(postsData);
      setPage(2);
    } catch (error) {
      setError('Failed to load feed. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosts(pageNum) {
    const allPosts = [];
    for (const userId of Object.keys(users)) {
      const userPosts = await api.getUserPosts(userId);
      allPosts.push(...userPosts.posts.map(post => ({
        ...post,
        user: users[post.userId]
      })));
    }
    return allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async function fetchMorePosts() {
    try {
      if (!hasMore) {
        setIsFetching(false);
        return;
      }

      const morePosts = await fetchPosts(page);
      if (morePosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...morePosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setIsFetching(false);
    }
  }

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
    <>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        {posts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Post post={post} />
          </Grid>
        ))}
      </Grid>
      
      {isFetching && (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {!hasMore && posts.length > 0 && (
        <Box p={4} textAlign="center">
          <Typography color="textSecondary">
            No more posts to load
          </Typography>
        </Box>
      )}
    </>
  );
}

export default Feed; 