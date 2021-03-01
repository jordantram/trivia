import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Text } from '@chakra-ui/react';

const GameSummary = ({ score, numOfQuestions, resetGame }) => {
  let history = useHistory();

  const playAgain = () => {
    history.push("/");
    resetGame();
  }

  return (
    <Box width="4xl" as="section" align="center" position="fixed" top="35%" left="50%" transform="translate(-50%, -50%)">
      <Text mt="4" fontSize="lg">
        You finished with a score of {score} out of {numOfQuestions}{(score / numOfQuestions >= 0.8) ? "!" : "."}
      </Text>
      {(score / numOfQuestions >= 0.8)
        ? <Text mt="1" fontSize="lg">
            You're a trivia expert!
          </Text>
        : null}
      <Button onClick={playAgain} mt={5} size="lg" colorScheme="blue"
        fontWeight="bold" fontSize={{ sm: "1rem", md: "1.125rem" }}>
        Play Again!
      </Button>
    </Box>
  );
};

export default GameSummary;