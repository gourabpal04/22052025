import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography } from '@material-ui/core';

function UserCard({ user }) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            {user.name.charAt(0)}
          </Avatar>
        }
        title={user.name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          User ID: {user.id}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default UserCard; 