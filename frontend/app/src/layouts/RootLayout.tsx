import { Box, Toolbar, CssBaseline, Typography, AppBar } from '@mui/material';

type MainLayoutProps = {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{bgcolor: '#28282a'}}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Georgia' }}>
            Flight Checker
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
