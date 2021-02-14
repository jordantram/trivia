import React from 'react';
import { Box, Flex, Heading, Select, FormControl, FormLabel, Button, Input,
         NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } 
        from '@chakra-ui/react';

const QuizSetup = ({ mode, categories }) => {
  const categorySelections = categories.map(category => {
    return (
      <option key={category.id} value={category.id}>{category.name}</option>
    );
  });

  return (
    <Flex width="full" align="center" justifyContent="center" position="fixed" top="10%">
      <Box p={8} borderWidth="1px" borderRadius="md" boxShadow="md">
        <Heading size="lg" align="center">Create Game</Heading>
        <form>
          <FormControl mt="2em">
            <FormLabel>Number of Questions:</FormLabel>
            <NumberInput defaultValue={10} min={5} max={25}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl mt="1.5em">
            <FormLabel>Select Difficulty:</FormLabel>
            <Select placeholder="Any Difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FormControl>
          <FormControl mt="1.5em">
            <FormLabel>Select Category:</FormLabel>
            <Select placeholder="Any Category">
              {categorySelections}
            </Select>
          </FormControl>
          {mode === 'multiplayer'
            ? <FormControl mt="1.5em" isRequired>
                <FormLabel>Room Code:</FormLabel>
                <Input placeholder="Enter a unique room name" />
              </FormControl>
            : null }
          <Button size="md" colorScheme="blue" fontWeight="bold" mt="2em" width="full">
            Start!
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default QuizSetup;