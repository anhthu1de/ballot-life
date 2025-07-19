import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Lock as LockIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Hooks
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoginPrompt?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  showLoginPrompt = true,
}) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress size={48} />
        </motion.div>
      </Box>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: show login prompt
  if (showLoginPrompt) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
            }}
          >
            <Box mb={3}>
              <LockIcon
                sx={{
                  fontSize: 64,
                  color: 'primary.main',
                  opacity: 0.7,
                }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Authentication Required
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: 4 }}
            >
              You need to sign in with Internet Identity to access this page.
              Your identity is secure and private.
            </Typography>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={login}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                Sign In with Internet Identity
              </Button>
            </motion.div>

            <Box mt={4}>
              <Typography variant="caption" color="text.secondary">
                Internet Identity provides secure, anonymous authentication
                <br />
                without storing personal information.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Fallback: render nothing
  return null;
};

// Higher-order component version for class components or other use cases
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    showLoginPrompt?: boolean;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute
        fallback={options?.fallback}
        showLoginPrompt={options?.showLoginPrompt}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withProtectedRoute(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

// Hook for checking route protection status
export const useRouteProtection = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isProtected: !isAuthenticated && !isLoading,
    isLoading,
    isAuthenticated,
  };
};