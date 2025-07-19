import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { usePolls } from '../hooks/useBackend';
import { formatPrincipal } from '../utils';

const PollListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: polls, isLoading, error } = usePolls();

  const handlePollClick = (pollId: string | number) => {
    navigate(`/poll/${pollId}`);
  };

  const handleCreatePoll = () => {
    navigate('/newPoll');
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Error loading polls. Please try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Decentralized Voting Platform
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Participate in polls and create your own voting campaigns
          </Typography>
        </Box>

        {isAuthenticated && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreatePoll}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              New Poll
            </Button>
          </motion.div>
        )}
      </Box>

      {/* Polls List */}
      {!polls || polls.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
            borderRadius: 3,
          }}
        >
          <VoteIcon
            sx={{
              fontSize: 64,
              color: 'text.secondary',
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No polls created so far
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Be the first to create a poll and start engaging with the community!
          </Typography>
          {isAuthenticated && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreatePoll}
              sx={{ mt: 2 }}
            >
              Create First Poll
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {polls.map((poll, index) => {
            const pollId = poll.id.toString();
            return (
              <Grid item xs={12} sm={6} md={4} key={pollId}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    onClick={() => handlePollClick(pollId)}
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
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {poll.name}
                        </Typography>
                        <Chip
                          label={poll.ballotingOpen ? 'Open' : 'Closed'}
                          color={poll.ballotingOpen ? 'success' : 'error'}
                          size="small"
                          sx={{ flexShrink: 0 }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Created by: {formatPrincipal(poll.creator)}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <VoteIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="primary">
                          {poll.ballotingOpen ? 'Active voting' : 'Voting closed'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default PollListPage;