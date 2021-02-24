import React from 'react';
import { Box, Center } from '@chakra-ui/react';

const Question = ({ category, difficulty, question }) => {
  return (
    <Center p={8} h={125} borderWidth="1px" borderRadius="md" boxShadow="md">
      {question}
    </Center>
  );
};

export default Question;