import React from "react";
import logo from "./logo.svg";
import "./App.css";

var socket = require("socket.io-client")(process.env.REACT_APP_CHATROOM_SERVER_URL);
socket.on("connect", function() {
  console.log("connected to server");
});

socket.on("event", function(data) {
  console.log("event received");
});

socket.on("disconnect", function() {
  console.log("disconnected from server");
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
