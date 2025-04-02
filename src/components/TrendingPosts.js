import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { api } from '../services/api';
import Post from './Post';

function TrendingPosts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
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

        allPosts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        setPosts(allPosts.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3} style={{ marginTop: 20 }}>
      {posts.map(post => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default TrendingPosts; 