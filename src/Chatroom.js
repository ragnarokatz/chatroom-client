import React, { Component } from "react";
import "./Chatroom.css";

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.handleOnReceiveUsername = this.handleOnReceiveUsername.bind(this);
    this.handleOnReceiveChatHistory = this.handleOnReceiveChatHistory.bind(
      this
    );
    this.handleOnReceiveMessage = this.handleOnReceiveMessage.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

    this.socket.on("message", this.handleOnReceiveMessage);
    this.socket.on("history", this.handleOnReceiveChatHistory);
    this.socket.on("username", this.handleOnReceiveUsername);

    this.socket.on("disconnect", function() {
      console.log("disconnected from server");
    });
    this.socket.on("connect", function() {
      console.log("connected to server");
    });
  }

  socket = require("socket.io-client")(
    process.env.REACT_APP_CHATROOM_SERVER_URL
  );
  state = { receivedMessages: [], inputMessage: "" };
  username = "ME";

  handleOnReceiveUsername(username) {
    this.username = username;
  }

  handleOnReceiveChatHistory(data) {
    console.log("historical data received");
  }

  handleOnReceiveMessage(obj) {
    console.log(`message received: ${obj.text}`);

    obj.orientation = "left";
    let messages = this.state.receivedMessages;
    messages.unshift(obj);
    this.setState({ receivedMessages: messages });
  }

  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOnSubmit(e) {
    console.log("invoke handle send message");

    e.preventDefault();
    let message = this.state.inputMessage;

    if (message.trim()) {
      this.socket.emit("message", message);
      let obj = {
        sender: this.username,
        text: message,
        time: new Date(),
        orientation: "right"
      };
      let messages = this.state.receivedMessages;
      messages.unshift(obj);
      this.setState({ receivedMessages: messages, inputMessage: "" });
    }
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.handleOnSubmit(e);
    }
  }

  render() {
    let rows = this.state.receivedMessages.map((obj, index) => {
      return (
        <ListRow
          sender={obj.sender}
          text={obj.text}
          time={obj.time}
          key={index}
        ></ListRow>
      );
    });

    return (
      <div class="App">
        <div class="col-md-12">
          <div class="panel panel-primary">
            <div class="panel-footer">
              <div class="input-group">
                <input
                  id="btn-input"
                  name="inputMessage"
                  type="text"
                  class="form-control input-lg"
                  value={this.state.inputMessage}
                  placeholder="Type your message here..."
                  onKeyDown={this.handleOnKeyDown}
                  onChange={this.handleOnChange}
                />
                <span class="input-group-btn">
                  <button
                    class="btn btn-warning btn-lg"
                    onClick={this.handleOnSubmit}
                    id="btn-chat"
                  >
                    Send
                  </button>
                </span>
              </div>
            </div>
            <div class="panel-body">
              <ul class="chat">{rows}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ListRow = props => {
  return props.orientation === "left" ? (
    <li class="left clearfix">
      <span class="chat-img pull-left">
        <img
          src="http://placehold.it/50/55C1E7/fff&text=U"
          alt="User Avatar"
          class="img-circle"
        />
      </span>
      <div class="chat-body clearfix">
        <div class="header">
          <strong class="primary-font">{props.sender}</strong>{" "}
          <small class="pull-right text-muted">
            <span class="glyphicon glyphicon-time"></span>12 mins ago
          </small>
        </div>
        <p>{props.text}</p>
      </div>
    </li>
  ) : (
    <li class="right clearfix">
      <span class="chat-img pull-right">
        <img
          src="http://placehold.it/50/FA6F57/fff&text=ME"
          alt="User Avatar"
          class="img-circle"
        />
      </span>
      <div class="chat-body clearfix">
        <div class="header">
          <small class=" text-muted">
            <span class="glyphicon glyphicon-time"></span>15 mins ago
          </small>
          <strong class="pull-right primary-font">{props.sender}</strong>
        </div>
        <p>{props.text}</p>
      </div>
    </li>
  );
};

export default Chatroom;
