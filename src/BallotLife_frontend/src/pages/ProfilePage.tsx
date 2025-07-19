import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon - User dashboard with created polls, voting history, and statistics.
      </Typography>
    </Container>
  );
};

export default ProfilePage;