import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  HowToVote as VoteIcon,
  Close as CloseIcon,
  PlayArrow as OpenIcon,
  BarChart as ChartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { 
  usePollDetail, 
  useAddCandidate, 
  useCastBallot, 
  useCloseBalloting, 
  useReopenBalloting 
} from '../hooks/useBackend';
import { formatPrincipal, formatTimeAgo } from '../utils';
import { VALIDATION } from '../constants';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Form validation schemas
const addCandidateSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.CANDIDATE_NAME.MIN_LENGTH, 'Candidate name is required')
    .max(VALIDATION.CANDIDATE_NAME.MAX_LENGTH, `Name must be no more than ${VALIDATION.CANDIDATE_NAME.MAX_LENGTH} characters`)
    .trim(),
});

type AddCandidateFormData = z.infer<typeof addCandidateSchema>;

const PollDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  
  // Backend hooks
  const { data: poll, isLoading, error, refetch } = usePollDetail(id);
  const addCandidateMutation = useAddCandidate();
  const castBallotMutation = useCastBallot();
  const closeBallotingMutation = useCloseBalloting();
  const reopenBallotingMutation = useReopenBalloting();

  // UI state
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Add candidate form
  const {
    control: candidateControl,
    handleSubmit: handleCandidateSubmit,
    formState: { errors: candidateErrors },
    reset: resetCandidateForm,
  } = useForm<AddCandidateFormData>({
    resolver: zodResolver(addCandidateSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  // Handlers
  const handleBack = () => navigate('/');

  const onAddCandidate = async (data: AddCandidateFormData) => {
    if (!id) return;
    
    try {
      setSubmitError(null);
      await addCandidateMutation.mutateAsync({
        pollId: id,
        candidateName: data.name,
      });
      
      resetCandidateForm();
      setShowAddCandidate(false);
      refetch();
    } catch (error: any) {
      console.error('Add candidate error:', error);
      setSubmitError(error.message || 'Failed to add candidate');
    }
  };

  const onCastVote = async () => {
    if (!id || !selectedCandidate) return;

    try {
      setSubmitError(null);
      await castBallotMutation.mutateAsync({
        pollId: id,
        candidate: selectedCandidate,
      });
      
      setShowVoteDialog(false);
      setSelectedCandidate('');
      refetch();
    } catch (error: any) {
      console.error('Cast vote error:', error);
      setSubmitError(error.message || 'Failed to cast vote');
    }
  };

  const handleClosePoll = async () => {
    if (!id) return;
    
    try {
      await closeBallotingMutation.mutateAsync(id);
      refetch();
    } catch (error: any) {
      console.error('Close poll error:', error);
    }
  };

  const handleReopenPoll = async () => {
    if (!id) return;
    
    try {
      await reopenBallotingMutation.mutateAsync(id);
      refetch();
    } catch (error: any) {
      console.error('Reopen poll error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error || !poll) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load poll details. Please try again.
        </Alert>
      </Container>
    );
  }

  // Check if user is poll creator
  const isCreator = principal && poll.creator.toString() === principal.toString();

  // Check if user has voted
  const userVote = poll.ballots.find(ballot => 
    principal && ballot.voter.toString() === principal.toString()
  );

  // Calculate total votes
  const totalVotes = poll.ballotCount.reduce((sum, [, count]) => sum + Number(count), 0);

  // Prepare chart data
  const chartData = {
    labels: poll.ballotCount.map(([candidate]) => candidate),
    datasets: [
      {
        label: 'Votes',
        data: poll.ballotCount.map(([, count]) => Number(count)),
        backgroundColor: '#1976D2',
        borderColor: '#1565C0',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Voting Results' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <Box mb={4}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Back to Polls
          </Button>
          
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                {poll.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Created by {formatPrincipal(poll.creator)}
              </Typography>
            </Box>
            
            <Chip
              label={poll.ballotingOpen ? 'Open' : 'Closed'}
              color={poll.ballotingOpen ? 'success' : 'error'}
              size="large"
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Poll Management */}
          <Grid item xs={12} md={6}>
            {/* Admin Controls */}
            {isCreator && (
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Poll Management
                  </Typography>
                  
                  <Box display="flex" gap={2}>
                    <Button
                      variant={poll.ballotingOpen ? 'contained' : 'outlined'}
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={handleClosePoll}
                      disabled={!poll.ballotingOpen || closeBallotingMutation.isPending}
                    >
                      Close Voting
                    </Button>
                    
                    <Button
                      variant={!poll.ballotingOpen ? 'contained' : 'outlined'}
                      color="success"
                      startIcon={<OpenIcon />}
                      onClick={handleReopenPoll}
                      disabled={poll.ballotingOpen || reopenBallotingMutation.isPending}
                    >
                      Reopen Voting
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Add Candidate */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Candidates ({poll.candidates.length})
                  </Typography>
                  
                  {isAuthenticated && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setShowAddCandidate(true)}
                      size="small"
                    >
                      Add Candidate
                    </Button>
                  )}
                </Box>

                {poll.candidates.length === 0 ? (
                  <Typography color="text.secondary">
                    No candidates added yet
                  </Typography>
                ) : (
                  <List dense>
                    {poll.candidates.map((candidate, index) => (
                      <ListItem key={candidate} divider={index < poll.candidates.length - 1}>
                        <ListItemText 
                          primary={candidate}
                          secondary={`${poll.ballotCount.find(([name]) => name === candidate)?.[1] || 0} votes`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Voting Interface */}
            {isAuthenticated && poll.ballotingOpen && poll.candidates.length > 0 && (
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cast Your Vote
                  </Typography>
                  
                  {userVote ? (
                    <Alert severity="info">
                      You have already voted for: <strong>{userVote.candidate}</strong>
                    </Alert>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<VoteIcon />}
                      onClick={() => setShowVoteDialog(true)}
                      fullWidth
                      size="large"
                      sx={{ borderRadius: 2 }}
                    >
                      Vote Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} md={6}>
            {/* Vote Counts */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Results ({totalVotes} votes)
                </Typography>
                
                {poll.ballotCount.length === 0 ? (
                  <Typography color="text.secondary">
                    No votes cast yet
                  </Typography>
                ) : (
                  <>
                    <Box mb={3}>
                      <Bar data={chartData} options={chartOptions} />
                    </Box>
                    
                    <List dense>
                      {poll.ballotCount
                        .sort((a, b) => Number(b[1]) - Number(a[1]))
                        .map(([candidate, count]) => {
                          const percentage = totalVotes > 0 ? (Number(count) / totalVotes * 100).toFixed(1) : '0';
                          return (
                            <ListItem key={candidate} divider>
                              <ListItemText
                                primary={candidate}
                                secondary={`${count} votes (${percentage}%)`}
                              />
                            </ListItem>
                          );
                        })}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Voting History */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Voting History
                </Typography>
                
                {poll.ballots.length === 0 ? (
                  <Typography color="text.secondary">
                    No votes recorded yet
                  </Typography>
                ) : (
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {poll.ballots.map((ballot, index) => (
                      <ListItem key={index} divider={index < poll.ballots.length - 1}>
                        <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={formatPrincipal(ballot.voter)}
                          secondary={`Voted for ${ballot.candidate} • ${formatTimeAgo(new Date(Number(ballot.timestamp / BigInt(1000000))))}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Add Candidate Dialog */}
      <Dialog 
        open={showAddCandidate} 
        onClose={() => setShowAddCandidate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 2, 
            pt: 3,
            fontSize: '1.5rem',
            fontWeight: 600,
            textAlign: 'center',
            color: 'primary.main'
          }}
        >
          Add New Candidate
        </DialogTitle>
        <form onSubmit={handleCandidateSubmit(onAddCandidate)}>
          <DialogContent sx={{ px: 3, pb: 2 }}>
            <Controller
              name="name"
              control={candidateControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Candidate Name"
                  placeholder="Enter candidate's full name"
                  error={!!candidateErrors.name}
                  helperText={candidateErrors.name?.message || 'Enter the name of the candidate you want to add'}
                  disabled={addCandidateMutation.isPending}
                  autoFocus
                  sx={{ 
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              )}
            />
            
            {submitError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  },
                }}
              >
                {submitError}
              </Alert>
            )}
          </DialogContent>
          
          <DialogActions 
            sx={{ 
              px: 3, 
              pb: 3, 
              pt: 1, 
              gap: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Button 
              onClick={() => setShowAddCandidate(false)}
              disabled={addCandidateMutation.isPending}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 120,
                height: 44,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={addCandidateMutation.isPending}
              startIcon={
                addCandidateMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 120,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(45deg, #1976D2, #42A5F5)',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565C0, #1976D2)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {addCandidateMutation.isPending ? 'Adding...' : 'Add Candidate'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Vote Dialog */}
      <Dialog
        open={showVoteDialog}
        onClose={() => setShowVoteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cast Your Vote</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Select a candidate:
            </FormLabel>
            <RadioGroup
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
            >
              {poll.candidates.map((candidate) => (
                <FormControlLabel
                  key={candidate}
                  value={candidate}
                  control={<Radio />}
                  label={candidate}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setShowVoteDialog(false)}
            disabled={castBallotMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={onCastVote}
            variant="contained"
            disabled={!selectedCandidate || castBallotMutation.isPending}
          >
            {castBallotMutation.isPending ? 'Voting...' : 'Cast Vote'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PollDetailPage;