import React, { useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Add as AddIcon,
  Person as PersonIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { AppHeader } from './AppHeader';
import { SideDrawer } from './SideDrawer';
import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Navigation items for bottom navigation (mobile)
  const navigationItems = [
    { label: 'Polls', value: '/', icon: <HomeIcon /> },
    { label: 'New Poll', value: '/newPoll', icon: <AddIcon />, requiresAuth: true },
  ];

  // Get current bottom navigation value
  const getCurrentNavValue = () => {
    const currentPath = location.pathname;
    const navItem = navigationItems.find(item => 
      item.value === currentPath || 
      (item.value === '/' && currentPath === '/')
    );
    return navItem?.value || '/';
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleBottomNavigation = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleCreateClick = () => {
    navigate('/newPoll');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* App Header */}
      <AppHeader onMenuClick={handleDrawerToggle} />

      {/* Side Drawer for tablet/desktop */}
      {!isMobile && (
        <SideDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant={isTablet ? 'temporary' : 'persistent'}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 8, sm: 10 }, // Account for app bar height
          pb: { xs: 10, md: 3 }, // Account for bottom navigation on mobile
          ml: { lg: drawerOpen ? 30 : 0 }, // Account for persistent drawer on desktop
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      {/* Bottom Navigation (Mobile only) */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <BottomNavigation
            value={getCurrentNavValue()}
            onChange={handleBottomNavigation}
            showLabels
            sx={{
              height: 70,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            {navigationItems.map((item) => {
              // Hide auth-required items if not authenticated
              if (item.requiresAuth && !isAuthenticated) {
                return null;
              }
              
              return (
                <BottomNavigationAction
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              );
            })}
          </BottomNavigation>
        </Box>
      )}

      {/* Floating Action Button for Create Poll */}
      {isAuthenticated && (
        <Zoom
          in={location.pathname !== '/newPoll'}
          timeout={200}
          unmountOnExit
        >
          <Fab
            color="primary"
            aria-label="create poll"
            onClick={handleCreateClick}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 85 : 20, // Account for bottom navigation on mobile
              right: 20,
              zIndex: theme.zIndex.speedDial,
              boxShadow: theme.shadows[8],
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: theme.shadows[12],
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}

      {/* Mobile drawer for menu */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              backgroundColor: 'background.paper',
            },
          }}
        >
          <SideDrawer
            open={true}
            onClose={handleDrawerToggle}
            variant="temporary"
            isMobile={true}
          />
        </Drawer>
      )}
    </Box>
  );
};