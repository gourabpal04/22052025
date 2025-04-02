import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Avatar, 
  IconButton, 
  Typography, 
  Collapse,
  Box,
  CircularProgress,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Comment, 
  Share
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../services/api';

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (expanded) {
      fetchComments();
    }
  }, [expanded]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.getPostComments(post.id);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setComments(prev => [...prev, {
        id: Date.now(),
        content: newComment,
        userId: 1,
        timestamp: new Date().toISOString()
      }]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar>
            {post.user?.name?.charAt(0) || 'U'}
          </Avatar>
        }
        title={post.user?.name}
        subheader={formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
      />
      <CardContent>
        <Typography variant="body1">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title={liked ? "Unlike" : "Like"}>
          <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          {likeCount}
        </Typography>
        
        <Tooltip title="Comments">
          <IconButton onClick={() => setExpanded(!expanded)}>
            <Comment />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          {comments.length}
        </Typography>

        <Tooltip title="Share">
          <IconButton>
            <Share />
          </IconButton>
        </Tooltip>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box p={2}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <Box mb={2}>
                {comments.map(comment => (
                  <Box key={comment.id} mb={1}>
                    <Typography variant="subtitle2">
                      User {comment.userId}
                    </Typography>
                    <Typography variant="body2">
                      {comment.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                >
                  Post
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}

export default Post; 