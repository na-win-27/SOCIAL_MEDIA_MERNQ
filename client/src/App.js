import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import "semantic-ui-css/semantic.min.css";
import Menubar from "./components/MenuBar";
import { Container } from "semantic-ui-react";
import "./App.css";

function App() {
  return (
    <Router>
      <Container>
        <Menubar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Container>
    </Router>
  );
}

export default App;
