import React from "react";
import "./App.css";
import AddPlayers from "./components/addPlayers";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Game from "./components/game";

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={AddPlayers} />
        <Route exact path="/game" component={Game} />
      </div>
    </Router>
  );
}

export default App;
