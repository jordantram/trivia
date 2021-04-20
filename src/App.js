import React, { useState, useEffect } from 'react';
import firebase from './firebase';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { Grid, GridItem, SimpleGrid, Text, useColorMode, Flex, IconButton, Spinner, Box } from '@chakra-ui/react';
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

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [categories, setCategories] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    numOfQuestions: 10,
    category: undefined,
    difficulty: undefined
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [revealAnswer, setRevealAnswer] = useState(false);

  const [timerID, setTimerID] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          }).then(() => {
            setCurrentUser({ ...user });
          })
        } else {
          setCurrentUser({ ...user });
        }
      } else {
        setCurrentUser(null);

        firebase.auth().signInAnonymously()
          .catch((error) => {
            alert("Failed to access server.");
          });
      } 
    }); 

    fetch("https://opentdb.com/api_category.php")
      .then(response => response.json())
      .then(data => setCategories(data.trivia_categories)) 
  }, []); // runs only once on initial render
  
  useEffect(() => {
    if (currentUser) {
      firebase.database().ref("users/" + currentUser.uid).set({
        displayName: currentUser.displayName
      })

      setLoading(false);
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

  const handleModeSelect = (mode, ID="") => {
    if (mode === "multiplayer") {
      if (currentUser) {
        firebase.database().ref(`games/${ID}/players/${currentUser.uid}`).set({
          role: "host"
        });

        firebase.database().ref(`games/${ID}/settings`).set({
          numOfQuestions: 10,
          category: "",
          difficulty: ""
        });
      }
    }
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
           `&category=${category ? category : ""}` +
           `&difficulty=${difficulty ? difficulty : ""}` + 
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
    }, 2000));
  }

  const resetGame = () => {
    setGameSettings({
      numOfQuestions: 10,
      category: undefined,
      difficulty: undefined
    });

    setQuestions([]);
    setCurrentQuestion(null);
    setScore(0);
    setRevealAnswer(false);

    setTimerID(null);
  }

  if (loading) {
    return (
      <Box as="section" position="fixed" top="35%" left="50%" transform="translate(-50%, -50%)"
        width={{ base: "100%" }}>
          <Box maxW="2xl" mx="auto" px={{ base: "6", lg: "8" }} py={{ base: "16", sm: "20" }} textAlign="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
      </Box>
    );
  }

  return (
    <Router>
      <IconButton onClick={toggleColorMode} 
        size="lg"
        aria-label="Toggle color mode" 
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        position="fixed" bottom="1em" right="1em" />
      <Switch>
        <Route exact path="/">
          <ModeSelect handleModeSelect={handleModeSelect} />
        </Route>
        <Route path="/setup">
          <QuizSetup match='' categories={categories} multiplayer={false} user={currentUser}
            gameSettings={gameSettings} setGameSettings={setGameSettings} handleFormSubmit={handleFormSubmit} />
        </Route>
        <Route path="/room/:id"
          render={({match}) => 
            <QuizSetup match={match} categories={categories} multiplayer={true} user={currentUser}
              gameSettings={gameSettings} setGameSettings={setGameSettings} handleFormSubmit={handleFormSubmit} />}>
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