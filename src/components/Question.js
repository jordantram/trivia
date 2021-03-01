import React from 'react';
import { Center } from '@chakra-ui/react';

const Question = ({ category, difficulty, question }) => {
  return (
    <Center align="center" p={8} h={125} borderWidth="1px" borderRadius="md" boxShadow="md">
      {question}
    </Center>
  );
};

export default Question;