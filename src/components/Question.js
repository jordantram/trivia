import React from 'react';
import { Box } from '@chakra-ui/react';

const Question = ({ category, difficulty, question }) => {
  return (
    <Box width="48.5em" p={8} mt={6} borderWidth="1px" borderRadius="md" boxShadow="md">
      Question: {question}
    </Box>
  );
};

export default Question;