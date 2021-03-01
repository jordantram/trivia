import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Heading, Select, FormControl, FormLabel, Button, Input, Text,
         NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } 
        from '@chakra-ui/react';

const QuizSetup = ({ mode, categories, gameSettings, setGameSettings, handleFormSubmit }) => {
  let history = useHistory();

  const numOfQuestionsField = useRef(null);
  const warning = useRef(null);

  const categorySelections = categories.map(category => {
    return (
      <option key={category.id} value={category.id}>{category.name}</option>
    );
  });

  const handleChange = (event) => {
    if (!event.target) { 
      // there is a bug in NumberInput where it returns event.target.value instead of event
      // this condition takes care of handling event change for NumberInput
      if (warning.current) {
        warning.current.style.marginTop = "";
        warning.current.textContent = "";
      }

      setGameSettings({
        ...gameSettings,
        numOfQuestions: event
      });
    } else {
      // normal case where component should return event
      setGameSettings({
        ...gameSettings,
        [event.target.name]: event.target.value
      });
    }
  }

  const onSubmit = (event) => {
    const value = numOfQuestionsField.current.value;

    if (value < 5 || value > 25) {
      event.preventDefault();
      warning.current.textContent = "Number of questions must be between 5 and 25!";
      warning.current.style.marginTop = "2em";
    } else {
      history.push("/play");
      handleFormSubmit(event);
    }
  }

  return (
    <Flex width="full" align="center" justifyContent="center" position="fixed" top="12.5%">
      <Box p={8} borderWidth="1px" borderRadius="md" boxShadow="md" 
        width={{ base: "85%", sm: "70%", md: "55%", lg: "45%", xl: "35%", "2xl": "25%" }}>
        <Heading size="lg" align="center">Create Game</Heading>
        <form onSubmit={onSubmit}>
          <FormControl mt="2em">
            <FormLabel>Number of Questions (between 5 and 25):</FormLabel>
            <NumberInput defaultValue={10} min={5} max={25} name="numOfQuestions" value={gameSettings.numOfQuestions} 
              clampValueOnBlur={false}
              onChange={handleChange} 
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}>
              <NumberInputField ref={numOfQuestionsField} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl mt="1.5em">
            <FormLabel>Select Category:</FormLabel>
            <Select placeholder="Any Category" name="category" value={gameSettings.category} onChange={handleChange}>
              {categorySelections}
            </Select>
          </FormControl>
          <FormControl mt="1.5em">
            <FormLabel>Select Difficulty:</FormLabel>
            <Select placeholder="Any Difficulty" name="difficulty" value={gameSettings.difficulty} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FormControl>
          {mode === 'multiplayer'
            ? <FormControl mt="1.5em" isRequired>
                <FormLabel>Room Code:</FormLabel>
                <Input placeholder="Enter a unique room name" name="roomCode" value={gameSettings.roomCode} onChange={handleChange} />
              </FormControl>
            : null }
          <Text color="red.500" align="center" ref={warning}></Text>
          <Button type="submit" size="md" colorScheme="blue" fontWeight="bold" fontSize="1.25em" mt="2em" width="full" pt="1.25em" pb="1.25em">
            Start!
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default QuizSetup;