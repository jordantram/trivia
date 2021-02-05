import React, { Component } from 'react';
import './App.css';
import ModeSelect from './components/ModeSelect.js';
import QuizSetup from './components/QuizSetup.js';
import QuestionCard from './components/QuestionCard.js';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <ModeSelect />
          </Route>
          <Route path="/setup">
            <QuizSetup />
          </Route>
          <Route path="/play">
            <QuestionCard />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
