import React from 'react';
import { Button } from '@chakra-ui/react';

const Answer = ({ answer, revealAnswer, correct, handleUserAnswer }) => {
  return (
    <Button width="sm"
      onClick={() => { handleUserAnswer(correct) }}
      colorScheme={revealAnswer ? (correct ? "green" : "red") : null}
      pointerEvents={revealAnswer ? "none" : null}
      style={revealAnswer ? null : { boxShadow: "none" }}>
      {answer}
    </Button>
  );
};

export default Answer;