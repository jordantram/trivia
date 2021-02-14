import React, { useState, useEffect } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(data => setCategories(data.trivia_categories)) 
    }, []);

  const onModeSelect = (mode) => {
    setGameMode(mode);
  };

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <ModeSelect onModeSelect={onModeSelect} />
          </Route>
          <Route path="/setup">
            <QuizSetup mode={gameMode} categories={categories} />
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