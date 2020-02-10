import React, { Component } from "react";


class Chatroom extends Component {
    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    socket = require("socket.io-client")(process.env.REACT_APP_CHATROOM_SERVER_URL);
    state = { receivedMessages: [] }

    handleOnChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSendMessage(e) {
        e.preventDefault();

        this.socket.emit('message', this.state.inputMessage);
    }

    componentDidMount() {
        this.socket.on("connect", function () {
            console.log("connected to server");
        });

        this.socket.on("message", function (message) {
            console.log("message received");
            let messages = this.state.receivedMessages;
            messages.push(message);
            this.setState({ receivedMessages: messages });
        });

        this.socket.on("disconnect", function () {
            console.log("disconnected from server");
        });
    }

    render() {
        let rows = this.state.receivedMessages.map((receivedMessage, index) => {
            return <ListRow receivedMessage={receivedMessage} key={index}></ListRow>
        })

        return (
            <div className="App">
                <div>
                    <ul id="receivedMessages">{rows}</ul>

                    <input id="inputMessage" name="inputMessage" className="form-control" autoComplete="off" onChange={this.handleOnChange} required />
                    <button onClick={this.handleSendMessage} className="btn btn-primary">Send</button>
                </div>
            </div>
        )
    }
}

const ListRow = props => {
    return (
        <li>{props.receivedMessage}</li>
    )
}

export default Chatroom;
