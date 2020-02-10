import React from "react";
import logo from "./logo.svg";
import "./App.css";

var socket = require("socket.io-client")(process.env.REACT_APP_CHATROOM_SERVER_URL);
socket.on("connect", function () {
  console.log("connected to server");
});

socket.on("event", function (data) {
  console.log("event received");
});

socket.on("disconnect", function () {
  console.log("disconnected from server");
});

function App() {
  return (
    <div className="App">
      <div>
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autoComplete="off" /><button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
