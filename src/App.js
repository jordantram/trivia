import React, { useState, useEffect } from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import ModeSelect from './components/ModeSelect';
import QuizSetup from './components/QuizSetup';
import Question from './components/Question';
import Answer from './components/Answer';
import Score from './components/Score';

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

    setCurrentQuestion(0);
    setScore(0);

    const { numOfQuestions, category, difficulty } = gameSettings;

    // Fetch questions/answers from OpenTrivia DB
    fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}` +
           `&category=${category ? category : ''}` +
           `&difficulty=${difficulty ? difficulty : ''}` + 
           `&type=multiple`)
      .then(response => response.json())
      .then(data => setQuestions(data.results)); 
  }

  const handleUserAnswer = () => {
    // Flash the chosen answer button red if incorrect (and correct answer button to green)
    // and green if correct
    setRevealAnswer(true);


    // Set score accordingly
    setScore(score + 1);


    // Wait for 2.5 seconds and turn off answer reveal and increment current question count
    setTimeout(() => {
      setRevealAnswer(false);
      setCurrentQuestion(currentQuestion + 1);
    }, 2500);
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
              ? <Box>
                  <Score score={score} />
                  <Question category={questions[currentQuestion].category} 
                    difficulty={questions[currentQuestion].difficulty}
                    question={questions[currentQuestion].question} />
                  <Answer answer={questions[currentQuestion].correct_answer} revealAnswer={revealAnswer} handleUserAnswer={handleUserAnswer} />
                  <Answer answer={questions[currentQuestion].incorrect_answers[0]} revealAnswer={revealAnswer} handleUserAnswer={handleUserAnswer} />
                  <Answer answer={questions[currentQuestion].incorrect_answers[1]} revealAnswer={revealAnswer} handleUserAnswer={handleUserAnswer} />
                  <Answer answer={questions[currentQuestion].incorrect_answers[2]} revealAnswer={revealAnswer} handleUserAnswer={handleUserAnswer} />
                </Box>
              : null
            }
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;