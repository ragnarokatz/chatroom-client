import React, { Component } from "react";
import "./Chatroom.css";
import { formatDatetimeString, generateImageUrl } from "./utils.js";
import { initializeSocket, registerEventListener, sendMessage } from "./socket.js";
import { getFingerprintId } from "./fingerprint.js";

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.handleOnReceiveUsername = this.handleOnReceiveUsername.bind(this);
    this.handleOnReceiveChatHistory = this.handleOnReceiveChatHistory.bind(
      this
    );
    this.handleOnReceiveMessage = this.handleOnReceiveMessage.bind(this);
    this.handleOnChangeInput = this.handleOnChangeInput.bind(this);
    this.handleOnSubmitInput = this.handleOnSubmitInput.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

    initializeSocket();
    registerEventListener("message", this.handleOnReceiveMessage);
    registerEventListener("history", this.handleOnReceiveChatHistory);
    registerEventListener("username", this.handleOnReceiveUsername);
    registerEventListener("disconnect", function () {
      console.log("disconnected from server");
    });
    registerEventListener("connect", function () {
      console.log("connected to server");
    });
  }

  state = { receivedMessages: [], inputMessage: "" };
  username = "ME";

  handleOnReceiveUsername(username) {
    this.username = username;
  }

  handleOnReceiveChatHistory(messages) {
    console.log("historical data received");
    this.setState({ receivedMessages: messages });
  }

  handleOnReceiveMessage(obj) {
    console.log(`message received: ${obj.text}`);

    let messages = this.state.receivedMessages;
    messages.unshift(obj);
    this.setState({ receivedMessages: messages });
  }

  handleOnChangeInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOnSubmitInput(e) {
    console.log("invoke handle send message");

    e.preventDefault();
    let message = this.state.inputMessage;

    if (message.trim()) {
      sendMessage(message);
      let obj = {
        sender: this.username,
        text: message,
        time: new Date()
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
      this.handleOnSubmitInput(e);
    }
  }

  componentDidMount() {
    getFingerprintId();
  }

  render() {
    let rows = this.state.receivedMessages.map((obj, index) => {
      return (
        <ListRow
          sender={obj.sender}
          text={obj.text}
          time={obj.time}
          username={this.username}
          key={index}
        ></ListRow>
      );
    });

    return (
      <div className="App">
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-footer">
              <div className="input-group">
                <input
                  id="btn-input"
                  name="inputMessage"
                  type="text"
                  className="form-control input-lg"
                  value={this.state.inputMessage}
                  placeholder="Type your message here..."
                  onKeyDown={this.handleOnKeyDown}
                  onChange={this.handleOnChangeInput}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-warning btn-lg"
                    onClick={this.handleOnSubmitInput}
                    id="btn-chat"
                  >
                    Send
                  </button>
                </span>
              </div>
            </div>
            <div className="panel-body">
              <ul className="chat">{rows}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ListRow = props => {
  return props.sender !== props.username ? (
    <li className="left clearfix">
      <span className="chat-img pull-left">
        <img
          src={generateImageUrl(props.sender)}
          alt="User Avatar"
          className="img-circle"
        />
      </span>
      <div className="chat-body clearfix">
        <div className="header">
          <strong className="primary-font">{props.sender}</strong>{" "}
          <small className="pull-right text-muted">
            <span className="glyphicon glyphicon-time"></span>
            {formatDatetimeString(props.time)}
          </small>
        </div>
        <p className="message-body">{props.text}</p>
      </div>
    </li>
  ) : (
      <li className="right clearfix">
        <span className="chat-img pull-right">
          <img
            src="https://placehold.it/50/FA6F57/fff&text=ME"
            alt="User Avatar"
            className="img-circle"
          />
        </span>
        <div className="chat-body clearfix">
          <div className="header">
            <small className=" text-muted">
              <span className="glyphicon glyphicon-time"></span>
              {formatDatetimeString(props.time)}
            </small>
            <strong className="pull-right primary-font">{props.sender}</strong>
          </div>
          <p className="message-body">{props.text}</p>
        </div>
      </li>
    );
};

export default Chatroom;
