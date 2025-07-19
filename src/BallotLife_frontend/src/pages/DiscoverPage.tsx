import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';

const DiscoverPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
        Discover Polls
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon - Advanced poll discovery with search and filtering capabilities.
      </Typography>
    </Container>
  );
};

export default DiscoverPage;