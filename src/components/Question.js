import React from 'react';
import { Box } from '@chakra-ui/react';

const Question = ({ category, difficulty, question }) => {
  return (
    <Box>
      Question: {question}
    </Box>
  );
};

export default Question;