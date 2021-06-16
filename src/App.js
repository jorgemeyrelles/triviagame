import React from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Game from './Pages/Game';
import Login from './Pages/Login';
import Feedback from './Pages/Feedback';
import Settings from './Pages/Settings';
import Ranking from './Pages/Ranking';

export default function App() {
  return (
    <div className="App">
      <Switch>
        {/* Atenção: Utilizar SEMPRE essa estrutura de Route */}
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
        <Route path="/feedback">
          <Feedback />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/ranking">
          <Ranking />
        </Route>
      </Switch>
    </div>
  );
}
