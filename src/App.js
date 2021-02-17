import React, { useState, useEffect } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import ModeSelect from './components/ModeSelect';
import QuizSetup from './components/QuizSetup';
import Question from './components/Question';
import Answer from './components/Answer';
import Score from './components/Score';

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

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
      .then(data => setQuestions(data.results)); 
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
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
          <Route path="/play">
            <Score />
            <Question />
            <Answer />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;