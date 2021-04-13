import React, { useRef, useEffect, useState } from 'react';
import firebase from '../firebase';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Heading, Select, FormControl, FormLabel, Button, Input, Text, useClipboard,
         NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } 
        from '@chakra-ui/react';

const QuizSetup = ({ match, categories, multiplayer, user, gameSettings, setGameSettings, handleFormSubmit }) => {
  let history = useHistory();

  const numOfQuestionsField = useRef(null);
  const warning = useRef(null);

  /* Below variables are used only for multiplayer game rooms */
  const [game, setGame] = useState(null); // grabs game info/settings from Firebase RTDB
  const [loading, setLoading] = useState(true); // need a loading screen while we asynchronously get info from RTDB
  const roomID = match ? match.params.id : '';
  const roomLink = window.location.origin + "/room/" + roomID;
  const { hasCopied, onCopy } = useClipboard(roomLink);

  useEffect(() => {
    let isMounted = true;
    const gamesRef = firebase.database().ref(`games/${roomID}`);

    gamesRef.once("value", snapshot => {
      if (snapshot.exists()) {
        const val = snapshot.val();

        if (isMounted) {
          setGame(val);
        }

        if (user && roomID) {
          if (!(user.uid in val.players)) {
            gamesRef.child("players").child(user.uid).set({
              role: "player"
            })
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    })

    return () => { isMounted = false };
  }, [user, roomID]); 

  if (loading) {
    return <Flex>Loading</Flex>;
  }

  if (!game) {
    return <Flex>Room does not exist!</Flex>;
  }

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
      warning.current.style.marginTop = "1.5em";
    } else {
      history.push("/play" + (multiplayer ? ("/" + gameSettings.roomID) : ""));
      handleFormSubmit(event);
    }
  }

  return (
    <Flex width="full" maxHeight="50%" align="center" justifyContent="center" mt="5%" mb="5%">
      <Box p={8} borderWidth="1px" borderRadius="md" boxShadow="md" 
        width={{ base: "85%", sm: "70%", md: "55%", lg: "45%", xl: "35%", "2xl": "25%" }}>
        <Heading size="lg" align="center">{multiplayer ? "Waiting Lobby" : "Create Game"}</Heading>
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
          {multiplayer
            ? <FormControl mt="1.5em">
                <FormLabel>Room Link (share this to invite other players):</FormLabel>
                <Flex mb={2}>
                  <Input name="roomID" value={roomLink} isReadOnly />
                  <Button onClick={onCopy} ml={2}>
                    {hasCopied ? "Copied!" : "Copy"}
                  </Button>
                </Flex>
              </FormControl>
            : null }
          <Text color="red.500" align="center" ref={warning}></Text>
          <Button type="submit" size="md" colorScheme="blue" fontWeight="bold" fontSize="1.25em" mt="1.5em" width="full" pt="1.25em" pb="1.25em">
            Start!
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default QuizSetup;