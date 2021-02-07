import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import ModeSelect from './components/ModeSelect';
import QuizSetup from './components/QuizSetup';
import Question from './components/Question';
import Score from './components/Score';

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
            <Score />
            <Question />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
