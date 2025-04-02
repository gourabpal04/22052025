import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  IconButton,
  useMediaQuery,
  CssBaseline,
  ThemeProvider
} from '@material-ui/core';
import { Brightness4, Brightness7 } from '@material-ui/icons';
import Feed from './components/Feed';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import { lightTheme, darkTheme } from './theme';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Social Media Analytics
            </Typography>
            <Button color="inherit" component={Link} to="/">FEED</Button>
            <Button color="inherit" component={Link} to="/top-users">TOP USERS</Button>
            <Button color="inherit" component={Link} to="/trending">TRENDING POSTS</Button>
            <IconButton 
              color="inherit" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="toggle dark mode"
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container style={{ marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/top-users" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App; 