import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Hooks
import { useCreatePoll } from '../hooks/useBackend';
import { VALIDATION } from '../constants';

// Form validation schema
const createPollSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.POLL_TITLE.MIN_LENGTH, `Name must be at least ${VALIDATION.POLL_TITLE.MIN_LENGTH} characters`)
    .max(VALIDATION.POLL_TITLE.MAX_LENGTH, `Name must be no more than ${VALIDATION.POLL_TITLE.MAX_LENGTH} characters`)
    .trim(),
});

type CreatePollFormData = z.infer<typeof createPollSchema>;

const CreatePollPage: React.FC = () => {
  const navigate = useNavigate();
  const createPollMutation = useCreatePoll();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreatePollFormData) => {
    try {
      setSubmitError(null);
      const pollId = await createPollMutation.mutateAsync({
        title: data.name,
        description: '',
        candidates: [],
        isPublic: true,
      });
      
      // Navigate to the newly created poll
      navigate(`/poll/${pollId}`);
    } catch (error: any) {
      console.error('Create poll error:', error);
      const errorMessage = error.message || error.toString();
      
      if (errorMessage.includes('Anonymous caller')) {
        setSubmitError('You must log in first');
      } else {
        setSubmitError(errorMessage);
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const isLoading = createPollMutation.isPending;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Create New Poll
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Create a new voting poll for your community
          </Typography>
        </Box>

        {/* Form */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ opacity: isLoading ? 0.5 : 1 }}
          >
            {/* Poll Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Poll Name"
                  placeholder="Enter your poll question or topic"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                  multiline
                  rows={3}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              )}
            />

            {/* Submit Error */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            {/* Submit Button */}
            <Box 
              display="flex" 
              justifyContent="flex-end" 
              alignItems="center"
              gap={2}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 140,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CreateIcon />
                  )
                }
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 140,
                  height: 48,
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
                {isLoading ? 'Creating...' : 'Create Poll'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Help Text */}
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            After creating your poll, you can add candidates and configure voting options.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CreatePollPage;