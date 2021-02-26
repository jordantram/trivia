import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
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

const App = () => {
  const [gameMode, setGameMode] = useState('');
  const [categories, setCategories] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    numOfQuestions: 10,
    category: undefined,
    difficulty: undefined,
    roomCode: ''
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(data => setCategories(data.trivia_categories)) 
  }, []); // runs only once on initial render

  /* To test fetching of questions from OpenTrivia DB
  useEffect(() => {
    console.log(questions)
  }, [questions]) */

  const handleModeSelect = (mode) => {
    setGameMode(mode);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setGameSettings({
      ...gameSettings,
      numOfQuestions: parseInt(gameSettings.numOfQuestions),
      category: gameSettings.category ? parseInt(gameSettings.category) : gameSettings.category
    });  

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
    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      setRevealAnswer(false);
    }, 2000);
  }

  const resetGame = () => {
    setGameMode('');
    setGameSettings({
      numOfQuestions: 10,
      category: undefined,
      difficulty: undefined,
      roomCode: ''
    });

    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setRevealAnswer(false);
  }

  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <ModeSelect handleModeSelect={handleModeSelect} />
          </Route>
          <Route path="/setup">
            {gameMode
              ? <QuizSetup mode={gameMode} categories={categories} 
                  gameSettings={gameSettings} setGameSettings={setGameSettings} handleFormSubmit={handleFormSubmit} />
              : <Redirect to={{ pathName: "/" }} />
            }
          </Route>
          <Route path="/play">
            {currentQuestion < questions.length
              ? <Box width="4xl" as="section" align="center" position="fixed" top="35%" left="50%" transform="translate(-50%, -50%)">
                  <Score score={score} />
                  <Grid gap={3}>
                    <GridItem colStart={1} colEnd={2} mb={3} mt={5}>
                      <Question category={questions[currentQuestion].category}
                        difficulty={questions[currentQuestion].difficulty}
                        question={decode(questions[currentQuestion].question)} />
                    </GridItem>
                    <SimpleGrid columns={2} spacing={3}>
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
                </Box>
              : (questions.length 
                ? <GameSummary score={score} numOfQuestions={gameSettings.numOfQuestions} resetGame={resetGame} /> 
                : null)
            }
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;