import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import GuestPage from './pages/guest';
import NewPage from './pages/new';
import AboutPage from './pages/about';
import SchedulePage from './pages/schedule';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <NewPage />  
          </Route>

          <Route path="/about">
            <AboutPage />  
          </Route>

          <Route path="/g/:id">
            <GuestPage />
          </Route>

          <Route path="/s/:id">
            <SchedulePage />
          </Route>

          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
