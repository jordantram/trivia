import React, { Component } from 'react';
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameMode: ''
    };
  }

  onModeSelect = (mode) => {
    this.setState({ gameMode: mode });
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <ModeSelect onModeSelect={this.onModeSelect} />
            </Route>
            <Route path="/setup">
              <QuizSetup mode={this.state.gameMode} />
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
}

export default App;