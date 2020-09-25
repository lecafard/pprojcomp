import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import GuestPage from "./pages/guest";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import ManageListPage from "./pages/manage/list";
import ManageMeetingPage from "./pages/manage/meeting";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <div id="app">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/about">
            <AboutPage />
          </Route>

          <Route path="/g/:id">
            <GuestPage />
          </Route>

          <Route path="/s" exact>
            <ManageListPage />
          </Route>

          <Route path="/s/:id">
            <ManageMeetingPage />
          </Route>

          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
