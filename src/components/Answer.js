import React from 'react';
import { Button } from '@chakra-ui/react';

const Answer = ({ answer, revealAnswer, correct, handleUserAnswer }) => {
  return (
    <Button height="3em"
      onClick={() => { handleUserAnswer(correct) }}
      colorScheme={revealAnswer ? (correct ? "green" : "red") : "blue"}
      pointerEvents={revealAnswer ? "none" : null}
      style={revealAnswer ? null : { boxShadow: "none" }}>
      {answer}
    </Button>
  );
};

export default Answer;