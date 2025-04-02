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
} from '@material-ui/core';
import { 
  Favorite, 
  FavoriteBorder, 
  Comment, 
  Share, 
  ExpandMore 
} from '@material-ui/icons';
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
      setComments(response.comments);
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
      // API call to post comment would go here
      setComments(prev => [...prev, {
        id: Date.now(),
        content: newComment,
        userId: 1, // Current user ID
        timestamp: new Date().toISOString()
      }]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Card elevation={3} className="post-card">
      <CardHeader
        avatar={
          <Avatar src={post.user?.avatar}>
            {post.user?.name.charAt(0)}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="span">
            {post.user?.name}
          </Typography>
        }
        subheader={formatTimestamp(post.timestamp)}
      />
      <CardContent>
        <Typography variant="body1" component="p">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={liked ? "Unlike" : "Like"}>
          <IconButton 
            onClick={handleLike}
            aria-label={liked ? "unlike post" : "like post"}
          >
            {liked ? <Favorite color="secondary" /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="textSecondary">
          {likeCount}
        </Typography>
        
        <Tooltip title="Comment">
          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-label="show comments"
          >
            <Comment />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" color="textSecondary">
          {comments.length}
        </Typography>

        <Tooltip title="Share">
          <IconButton aria-label="share post">
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
                    <Typography variant="subtitle2" component="span">
                      {comment.userName}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatTimestamp(comment.timestamp)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
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