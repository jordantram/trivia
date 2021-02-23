import React from 'react';
import { Button } from '@chakra-ui/react';

const Answer = ({ answer, revealAnswer, handleUserAnswer }) => {
  return (
    <Button onClick={handleUserAnswer}>
      {answer}
    </Button>
  );
};

export default Answer;