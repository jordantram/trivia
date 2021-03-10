import React from 'react';
import { generate } from 'project-name-generator';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Heading, Text, Stack, Icon } from '@chakra-ui/react';
import { FaUser, FaUsers } from 'react-icons/fa';

const ModeSelect = ({ handleModeSelect }) => {
  let history = useHistory();

  const onMultiplayerSelect = () => {
    const roomID = generate({ words: 3 }).dashed;
    handleModeSelect('multiplayer', roomID);
    history.push("/room/" + roomID);
  }

  return (
    <Box as="section" position="fixed" top="35%" left="50%" transform="translate(-50%, -50%)"
      width={{ base: "100%" }}>
      <Box maxW="2xl" mx="auto" px={{ base: '6', lg: '8' }} py={{ base: '16', sm: '20' }} textAlign="center">
        <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
          QuickTrivia
        </Heading>
        <Text mt="4" fontSize="lg">
          Welcome to QuickTrivia!
          How do you want to play?
        </Text>
        <Stack spacing={5} direction="row" align="center" justify="center" mt="8">
          <Button size="lg" colorScheme="blue" fontWeight="bold" fontSize={{ sm: "1rem", md: "1.125rem" }}>
            <Link to="/setup" onClick={() => { handleModeSelect('solo') }}>
              Play Solo &nbsp;
              <Icon as={FaUser} />
            </Link>
          </Button>
          <Button size="lg" colorScheme="blue" fontWeight="bold" fontSize={{ sm: "1rem", md: "1.125rem" }}
            onClick={onMultiplayerSelect}>
              Play With Friends &nbsp;
              <Icon as={FaUsers} />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ModeSelect;