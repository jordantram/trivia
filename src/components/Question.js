import React from 'react';
import { Center } from '@chakra-ui/react';

const Question = ({ category, difficulty, question }) => {
  return (
    <Center align="center" 
      h={{ base: "160px", sm: "150px", md: "140px", lg: "130px", xl: "130px", "2xl": "130px" }}
      p={8} borderWidth="1px" borderRadius="md" boxShadow="md" fontSize="lg">
      {question}
    </Center>
  );
};

export default Question;