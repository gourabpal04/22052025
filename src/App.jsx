import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Feed from './components/Feed';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Social Media Analytics
            </Typography>
            <Button color="inherit" component={Link} to="/">
              FEED
            </Button>
            <IconButton 
              color="inherit" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<Feed />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 