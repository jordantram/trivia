import React from 'react';
import { Box } from '@chakra-ui/react';

const Score = ({ score }) => {
  return (
    <Box fontWeight="bold">
      Score: {score}
    </Box>
  );
};

export default Score;