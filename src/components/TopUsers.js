import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { api } from '../services/api';
import UserCard from './UserCard';

function TopUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        setUsers(response.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Grid container spacing={3} style={{ marginTop: 20 }}>
      {users.map(user => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <UserCard user={user} />
        </Grid>
      ))}
    </Grid>
  );
}

export default TopUsers; 