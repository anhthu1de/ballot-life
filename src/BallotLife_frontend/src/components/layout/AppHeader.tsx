import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  InputBase,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { useTheme as useAppTheme } from '../../hooks/useTheme';
import { formatPrincipal } from '../../utils';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { isAuthenticated, principal, login, logout, isLoading } = useAuth();
  const { mode, toggleMode } = useAppTheme();
  
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      // For now, just navigate to home with search in URL params
      navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearch(false);
      setSearchValue('');
    }
  };

  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getThemeTooltip = () => {
    switch (mode) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      default:
        return 'Switch to light mode';
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: 64, sm: 70 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: { lg: 'none' },
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <VoteIcon
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  color: 'primary.main',
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                BallotLife
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {/* Center Section - Search (Desktop) */}
        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'action.hover',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              minWidth: 300,
              maxWidth: 400,
              flex: 1,
              mx: 3,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search polls..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                flex: 1,
                color: 'text.primary',
                '& input': {
                  padding: 0,
                },
              }}
            />
          </Box>
        )}

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Mobile Search */}
          {isMobile && (
            <IconButton
              onClick={() => setShowSearch(!showSearch)}
              sx={{ color: 'text.primary' }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Theme Toggle */}
          <Tooltip title={getThemeTooltip()}>
            <IconButton
              onClick={toggleMode}
              sx={{ color: 'text.primary' }}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          {/* Notifications (when authenticated) */}
          {isAuthenticated && (
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.primary' }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Section */}
          {isAuthenticated ? (
            <>
              <Chip
                avatar={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <AccountIcon fontSize="small" />
                  </Avatar>
                }
                label={principal ? formatPrincipal(principal) : 'User'}
                onClick={handleUserMenuOpen}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  display: { xs: 'none', sm: 'flex' },
                }}
              />
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  color: 'text.primary',
                  display: { xs: 'flex', sm: 'none' },
                }}
              >
                <AccountIcon />
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {isLoading ? 'Connecting...' : 'Sign In'}
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Search Bar */}
      {isMobile && showSearch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'action.hover',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search polls..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
                sx={{
                  flex: 1,
                  color: 'text.primary',
                }}
              />
            </Box>
          </Box>
        </motion.div>
      )}
    </AppBar>
  );
};