import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Add as AddIcon,
  Person as PersonIcon,
  BarChart as StatsIcon,
  Info as InfoIcon,
  HowToVote as VoteIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { usePollStats } from '../../hooks/useBackend';
import { formatPrincipal } from '../../utils';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  isMobile?: boolean;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  requiresAuth?: boolean;
  badge?: string | number;
  divider?: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  variant = 'temporary',
  isMobile = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, principal } = useAuth();
  const { totalPolls, activePolls } = usePollStats();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile || variant === 'temporary') {
      onClose();
    }
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      label: 'List Polls',
      path: '/',
      icon: <HomeIcon />,
      badge: totalPolls > 0 ? totalPolls : undefined,
    },
    {
      label: 'New Poll',
      path: '/newPoll',
      icon: <AddIcon />,
      requiresAuth: true,
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerWidth = 280;

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <VoteIcon sx={{ fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold">
              BallotLife
            </Typography>
          </Box>
          
          {isAuthenticated && principal && (
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                <AccountIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {formatPrincipal(principal)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Authenticated
                </Typography>
              </Box>
            </Box>
          )}
        </motion.div>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ pt: 2 }}>
          {navigationItems.map((item, index) => {
            // Skip auth-required items if not authenticated
            if (item.requiresAuth && !isAuthenticated) {
              return null;
            }

            const isActive = isActiveRoute(item.path);

            return (
              <React.Fragment key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 2,
                      minHeight: 48,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? 'inherit' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          backgroundColor: isActive
                            ? 'primary.contrastText'
                            : 'primary.main',
                          color: isActive
                            ? 'primary.main'
                            : 'primary.contrastText',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.divider && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          BallotLife v1.0.0
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          Powered by Internet Computer
        </Typography>
      </Box>
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transform: open ? 'none' : `translateX(-${drawerWidth}px)`,
            transition: theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};