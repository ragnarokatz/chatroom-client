import React, { Component } from "react";
import "./Chatroom.css";

class Chatroom extends Component {
    constructor(props) {
        super(props);

        this.handleOnReceiveMessage = this.handleOnReceiveMessage.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

        this.socket.on("connect", function () {
            console.log("connected to server");
        });

        this.socket.on("message", this.handleOnReceiveMessage);

        this.socket.on("disconnect", function () {
            console.log("disconnected from server");
        });
    }

    socket = require("socket.io-client")(process.env.REACT_APP_CHATROOM_SERVER_URL);
    state = { receivedMessages: [], inputMessage: '' };

    handleOnReceiveMessage(message) {
        console.log(`message received: ${message}`);
        let messages = this.state.receivedMessages;
        messages.unshift(message);
        this.setState({ receivedMessages: messages });
    }

    handleOnChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleOnSubmit(e) {
        console.log("invoke handle send message");

        e.preventDefault();

        if (this.state.inputMessage.trim()) {
            this.socket.emit('message', this.state.inputMessage);
            this.setState({ inputMessage: '' });
        }
    }

    handleOnKeyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.handleOnSubmit(e);
        }
    }

    componentDidMount() {

    }

    render() {
        let rows = this.state.receivedMessages.map((receivedMessage, index) => {
            return <ListRow receivedMessage={receivedMessage} key={index}></ListRow>
        })

        return (
            <div class="App">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-primary">
                                <div class="panel-footer">
                                    <div class="input-group">
                                        <input id="btn-input" name="inputMessage" type="text" class="form-control input-sm" value={this.state.inputMessage}
                                            placeholder="Type your message here..." onKeyDown={this.handleOnKeyDown} onChange={this.handleOnChange} />
                                        <span class="input-group-btn">
                                            <button class="btn btn-warning btn-sm" onClick={this.handleOnSubmit} id="btn-chat">
                                                Send</button>
                                        </span>
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <ul class="chat">
                                        {rows}
                                        <li class="left clearfix"><span class="chat-img pull-left">
                                            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                                        </span>
                                            <div class="chat-body clearfix">
                                                <div class="header">
                                                    <strong class="primary-font">Jack Sparrow</strong> <small class="pull-right text-muted">
                                                        <span class="glyphicon glyphicon-time"></span>12 mins ago</small>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales. adfafdasfdas fasdfadfasfdsadfasdfsadfafaf
                                                    asdfasfdasfasfasfsafasf
                                                    afdasfdasfsfasfasfasf
                                                    afdafdasdf
                                </p>
                                            </div>
                                        </li>
                                        <li class="right clearfix"><span class="chat-img pull-right">
                                            <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
                                        </span>
                                            <div class="chat-body clearfix">
                                                <div class="header">
                                                    <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>13 mins ago</small>
                                                    <strong class="pull-right primary-font">Bhaumik Patel</strong>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        <li class="left clearfix"><span class="chat-img pull-left">
                                            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                                        </span>
                                            <div class="chat-body clearfix">
                                                <div class="header">
                                                    <strong class="primary-font">Jack Sparrow</strong> <small class="pull-right text-muted">
                                                        <span class="glyphicon glyphicon-time"></span>14 mins ago</small>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        <li class="right clearfix"><span class="chat-img pull-right">
                                            <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
                                        </span>
                                            <div class="chat-body clearfix">
                                                <div class="header">
                                                    <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>15 mins ago</small>
                                                    <strong class="pull-right primary-font">Bhaumik Patel</strong>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ListRow = props => {
    return (
        <li class="left clearfix"><span class="chat-img pull-left">
            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
        </span>
            <div class="chat-body clearfix">
                <div class="header">
                    <strong class="primary-font">Jack Sparrow</strong> <small class="pull-right text-muted">
                        <span class="glyphicon glyphicon-time"></span>12 mins ago</small>
                </div>
                <p>
                    {props.receivedMessage}
                </p>
            </div>
        </li>
    )
}

export default Chatroom;
