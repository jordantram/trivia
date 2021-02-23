import React from 'react';
import { Box } from '@chakra-ui/react';

const Score = ({ score }) => {
  return (
    <Box>
      Score: {score}
    </Box>
  );
};

export default Score;