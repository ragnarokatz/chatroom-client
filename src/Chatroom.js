import React, { Component } from "react";
import "./Chatroom.css";
import Fingerprint2 from "fingerprintjs2";
import { formatDatetimeString, generateImageUrl } from "./utils.js";

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.handleOnFingerprint = this.handleOnFingerprint.bind(this);

    var options = {};
    Fingerprint2.get(options, this.handleOnFingerprint);

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
  fingerprintId = "fingerprintId";
  username = "username";

  handleOnFingerprint(components) {
    var values = components.map(function(component) {
      return component.value;
    });

    this.fingerprintId = Fingerprint2.x64hash128(values.join(""), 27);
    this.socket.emit("fingerprintId", this.fingerprintId);
  }

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
                  onChange={this.handleOnChange}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-warning btn-lg"
                    onClick={this.handleOnSubmit}
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
        <p>{props.text}</p>
      </div>
    </li>
  ) : (
    <li className="right clearfix">
      <span className="chat-img pull-right">
        <img
          src="http://placehold.it/50/FA6F57/fff&text=ME"
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
        <p>{props.text}</p>
      </div>
    </li>
  );
};

export default Chatroom;
