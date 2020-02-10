import React, { Component } from "react";


class Chatroom extends Component {
    constructor(props) {
        super(props);

        this.handleOnReceiveMessage = this.handleOnReceiveMessage.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);

        this.socket.on("connect", function () {
            console.log("connected to server");
        });

        this.socket.on("message", this.handleOnReceiveMessage);

        this.socket.on("disconnect", function () {
            console.log("disconnected from server");
        });
    }

    socket = require("socket.io-client")(process.env.REACT_APP_CHATROOM_SERVER_URL);
    state = { receivedMessages: [] }

    handleOnReceiveMessage(message) {
        console.log(`message received: ${message}`);
        let messages = this.state.receivedMessages;
        messages.push(message);
        this.setState({ receivedMessages: messages });
    }

    handleOnChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSendMessage(e) {
        console.log("invoke handle send message");

        e.preventDefault();

        if (this.state.inputMessage)
            this.socket.emit('message', this.state.inputMessage);
    }

    componentDidMount() {

    }

    render() {
        let rows = this.state.receivedMessages.map((receivedMessage, index) => {
            return <ListRow receivedMessage={receivedMessage} key={index}></ListRow>
        })

        return (
            <div className="App">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="panel panel-primary">
                                <div className="panel-body">
                                    <ul className="chat">
                                        <li className="left clearfix"><span className="chat-img pull-left">
                                            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" className="img-circle" />
                                        </span>
                                            <div className="chat-body clearfix">
                                                <div className="header">
                                                    <strong className="primary-font">Jack Sparrow</strong> <small className="pull-right text-muted">
                                                        <span className="glyphicon glyphicon-time"></span>12 mins ago</small>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        <li className="right clearfix"><span className="chat-img pull-right">
                                            <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" className="img-circle" />
                                        </span>
                                            <div className="chat-body clearfix">
                                                <div className="header">
                                                    <small className=" text-muted"><span className="glyphicon glyphicon-time"></span>13 mins ago</small>
                                                    <strong className="pull-right primary-font">Bhaumik Patel</strong>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        <li className="left clearfix"><span className="chat-img pull-left">
                                            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" className="img-circle" />
                                        </span>
                                            <div className="chat-body clearfix">
                                                <div className="header">
                                                    <strong className="primary-font">Jack Sparrow</strong> <small className="pull-right text-muted">
                                                        <span className="glyphicon glyphicon-time"></span>14 mins ago</small>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        <li className="right clearfix"><span className="chat-img pull-right">
                                            <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" className="img-circle" />
                                        </span>
                                            <div className="chat-body clearfix">
                                                <div className="header">
                                                    <small className=" text-muted"><span className="glyphicon glyphicon-time"></span>15 mins ago</small>
                                                    <strong className="pull-right primary-font">Bhaumik Patel</strong>
                                                </div>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare
                                                    dolor, quis ullamcorper ligula sodales.
                                </p>
                                            </div>
                                        </li>
                                        {rows}
                                    </ul>
                                </div>
                                <div className="panel-footer">
                                    <div className="input-group">
                                        <input id="btn-input" name="inputMessage" type="text" className="form-control input-sm"
                                            placeholder="Type your message here..." onChange={this.handleOnChange} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-warning btn-sm" onClick={this.handleSendMessage} id="btn-chat">
                                                Send</button>
                                        </span>
                                    </div>
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
        <li className="left clearfix"><span className="chat-img pull-left">
            <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" className="img-circle" />
        </span>
            <div className="chat-body clearfix">
                <div className="header">
                    <strong className="primary-font">Jack Sparrow</strong> <small className="pull-right text-muted">
                        <span className="glyphicon glyphicon-time"></span>12 mins ago</small>
                </div>
                <p>
                    {props.receivedMessage}
                </p>
            </div>
        </li>
    )
}

export default Chatroom;
