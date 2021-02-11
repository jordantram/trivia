import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Heading, Text, Stack, Icon } from '@chakra-ui/react';
import { FaUser, FaUsers } from 'react-icons/fa';

const ModeSelect = ({ onModeSelect }) => {
  return (
    <Box as="section" position="fixed" top="35%" left="50%" transform="translate(-50%, -50%)">
      <Box maxW="2xl" mx="auto" px={{ base: '6', lg: '8' }} py={{ base: '16', sm: '20' }} textAlign="center">
        <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
          QuickTrivia
        </Heading>
        <Text mt="4" fontSize="lg">
          Welcome to QuickTrivia! How do you want to play?
        </Text>
        <Stack spacing={5} direction="row" align="center" justify="center" mt="8">
          <Button size="lg" colorScheme="blue" fontWeight="bold">
            <Link to="/setup" onClick={() => { onModeSelect('solo') }}>
              Play Solo &nbsp;
              <Icon as={FaUser} />
            </Link>
          </Button>
          <Button size="lg" colorScheme="blue" fontWeight="bold">
            <Link to="/setup" onClick={() => { onModeSelect('multiplayer') }}>
              Play With Friends &nbsp;
              <Icon as={FaUsers} />
            </Link>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ModeSelect;