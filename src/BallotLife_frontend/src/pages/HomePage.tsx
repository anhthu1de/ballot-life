import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Explore as ExploreIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { usePolls, usePollStats } from '../hooks/useBackend';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: polls, isLoading } = usePolls();
  const { totalPolls, activePolls } = usePollStats();

  const features = [
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Secure & Private',
      description: 'Built on Internet Computer with Internet Identity authentication',
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'Fast & Reliable',
      description: 'Lightning-fast voting with real-time results',
    },
    {
      icon: <VoteIcon fontSize="large" />,
      title: 'Democratic',
      description: 'Fair and transparent voting for everyone',
    },
  ];

  const featuredPolls = polls?.filter(poll => poll.ballotingOpen).slice(0, 3) || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          borderRadius: 4,
          mb: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VoteIcon
            sx={{
              fontSize: { xs: 60, md: 80 },
              color: 'primary.main',
              mb: 3,
            }}
          />
          
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
            }}
          >
            Welcome to BallotLife
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            The future of decentralized voting. Create polls, cast votes, 
            and see results in real-time on the Internet Computer.
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ExploreIcon />}
                onClick={() => navigate('/discover')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Explore Polls
              </Button>
            </motion.div>

            {isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/create')}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Create Poll
                </Button>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Box>

      {/* Statistics */}
      <Box mb={8}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {totalPolls}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Polls
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="h3" color="secondary" fontWeight="bold">
                  {activePolls}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Active Polls
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  100%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Uptime
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box mb={8}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="primary"
        >
          Why Choose BallotLife?
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Polls */}
      {featuredPolls.length > 0 && (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              color="primary"
            >
              Active Polls
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/discover')}
              sx={{ textTransform: 'none' }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredPolls.map((poll, index) => (
              <Grid item xs={12} sm={6} md={4} key={poll.id.toString()}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => navigate(`/poll/${poll.id}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {poll.name}
                        </Typography>
                        <Chip
                          label="Open"
                          color="success"
                          size="small"
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Created by: {poll.creator.toString().slice(0, 8)}...
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary">
                          Active voting
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;