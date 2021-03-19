import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { Grid, GridItem, SimpleGrid, Text, useColorMode, Flex, IconButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { decode } from 'html-entities';
import { shuffle } from 'd3-array';
import './App.css';
import ModeSelect from './components/ModeSelect';
import QuizSetup from './components/QuizSetup';
import Question from './components/Question';
import Answer from './components/Answer';
import Score from './components/Score';
import GameSummary from './components/GameSummary';
import PlayerList from './components/PlayerList';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_DATABASE_URL
};

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [gameMode, setGameMode] = useState('');
  const [categories, setCategories] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    numOfQuestions: 10,
    category: undefined,
    difficulty: undefined,
    roomID: ''
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [revealAnswer, setRevealAnswer] = useState(false);

  const [timerID, setTimerID] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.isAnonymous && !user.displayName) {
          user.updateProfile({
            displayName: "Anonymous " + uniqueNamesGenerator({
              dictionaries: [colors, animals],
              length: 2,
              separator: " ",
              style: "capital"
            })
          })
        }

        setCurrentUser({ ...user });
      } else {
        firebase.auth().signInAnonymously()
          .catch((error) => {
            alert("Failed to access server.");
          });
      }
    });

    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(data => setCategories(data.trivia_categories)) 
  }, []); // runs only once on initial render

  useEffect(() => {
    if (currentUser) {
      firebase.database().ref('users/' + currentUser.uid).set({
        displayName: currentUser.displayName
      })
    }
  }, [currentUser]);

  /* Grabbing current authenticated user info
  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.displayName);
    }
  }, [currentUser]); */

  /* To test fetching of questions from OpenTrivia DB
  useEffect(() => {
    console.log(questions)
  }, [questions]) */

  const handleModeSelect = (mode, ID='') => {
    if (mode === 'multiplayer') {
      setGameSettings({ ...gameSettings, roomID: ID});
    }

    setGameMode(mode);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (timerID) {
      clearTimeout(timerID);
    }

    setGameSettings({
      ...gameSettings,
      numOfQuestions: parseInt(gameSettings.numOfQuestions),
      category: gameSettings.category ? parseInt(gameSettings.category) : gameSettings.category
    });  
    setCurrentQuestion(0);
    setScore(0);
    setRevealAnswer(false);

    const { numOfQuestions, category, difficulty } = gameSettings;

    // Fetch questions/answers from OpenTrivia DB
    fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}` +
           `&category=${category ? category : ''}` +
           `&difficulty=${difficulty ? difficulty : ''}` + 
           `&type=multiple`)
      .then(response => response.json())
      .then(data => { 
        setQuestions(data.results.map(question => {
          return (
            { ...question, answers: shuffle([question.correct_answer, ...question.incorrect_answers]) }
          );
        }));
      });
  }

  const handleUserAnswer = (correct) => {
    // Flash the chosen answer button red if incorrect (and correct answer button to green)
    // and green if correct
    setRevealAnswer(true);

    // Set score accordingly
    if (correct) {
      setScore(score + 1);
    }

    // Wait for 2 seconds then turn off answer reveal and increment current question count
    setTimerID(setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      setRevealAnswer(false);
    }, 300)); // change back to 2000 after
  }

  const resetGame = () => {
    setGameMode('');
    setGameSettings({
      numOfQuestions: 10,
      category: undefined,
      difficulty: undefined,
      roomID: ''
    });

    setQuestions([]);
    setCurrentQuestion(null);
    setScore(0);
    setRevealAnswer(false);

    setTimerID(null);
  }

  return (
    <Router>
      <IconButton onClick={toggleColorMode} 
        size="lg"
        aria-label="Toggle color mode" 
        icon={colorMode === 'light'? <MoonIcon /> : <SunIcon />}
        position="fixed" bottom="1em" right="1em" />
      <Switch>
        <Route exact path="/">
          <ModeSelect handleModeSelect={handleModeSelect} />
        </Route>
        <Route path="/setup">
          {gameMode
            ? <QuizSetup mode={gameMode} categories={categories} 
                gameSettings={gameSettings} setGameSettings={setGameSettings} handleFormSubmit={handleFormSubmit} />
            : <Redirect to={{ pathName: "/" }} />}
        </Route>
        <Route path="/room/:id">
          {gameMode
            ? <Flex>
                <QuizSetup mode={gameMode} categories={categories} 
                  gameSettings={gameSettings} setGameSettings={setGameSettings} handleFormSubmit={handleFormSubmit} />
                <PlayerList />
              </Flex>
            : <Redirect to={{ pathName: "/" }} />}
        </Route>
        <Route path="/play">
          { currentQuestion !== null
            ? (currentQuestion < questions.length
              ? <Flex flexDirection="column" className="center" justifyContent="center" mt="10%" mb="10%"
                  width={{ base: "90%", sm: "75%", md: "60%", lg: "70%", xl: "60%", "2xl": "50%" }}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontWeight="bold">Question: {currentQuestion + 1}/{questions.length}</Text>
                    <Score score={score} />
                  </Flex>
                  <Grid gap={3}>
                    <GridItem colStart={1} colEnd={2} mb={3} mt={5}>
                      <Question category={questions[currentQuestion].category}
                        difficulty={questions[currentQuestion].difficulty}
                        question={decode(questions[currentQuestion].question)} />
                    </GridItem>
                    <SimpleGrid columns={{ base: "1", sm: "1", md: "1", lg: "2", xl: "2", "2xl": "2" }} spacing={3}>
                      {questions[currentQuestion].answers.map((answerRaw, index) => {
                        return (
                          <Answer key={index} 
                            answer={decode(answerRaw)} 
                            revealAnswer={revealAnswer} 
                            correct={answerRaw === questions[currentQuestion].correct_answer ? true : false} 
                            handleUserAnswer={handleUserAnswer} />
                        );
                      })}
                    </SimpleGrid>
                  </Grid>
                </Flex>
              : (questions.length 
                ? <GameSummary score={score} numOfQuestions={gameSettings.numOfQuestions} resetGame={resetGame} /> 
                : null)
              )
            : <Redirect to={{ pathName: "/" }} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;