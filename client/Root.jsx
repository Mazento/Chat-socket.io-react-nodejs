import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import JoinWindow from './JoinWindow';
import Chatroom from './Chatroom';

import io from 'socket.io-client';

const socketURL = 'http://localhost:8080';

class Root extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      client: io.connect(socketURL),
      username: '',
      chatroomURL: '',
      chatHistory: [],
      userList: [],
      joinErrorMessage: ''
    }

    this.handleJoinChat = this.handleJoinChat.bind(this);
  }

  // handle the process of joining a chatroom
  handleJoinChat(username, chatroom) {
    this.state.client.emit('join', username, chatroom, (err, chatroomURL, chatHistory, userList) => {
      if (err) {
        // if attempt was unsuccessfull, display error message and abort
        this.setState({ joinErrorMessage: err });
        return;
      }
      // if attempt was successfull, save received data to the storage
      this.setState({ username, chatroomURL, chatHistory, userList });
    })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          {
            // if user has not joined yet, render join window
            !this.state.username
              ? <JoinWindow 
                  joinChat={this.handleJoinChat}
                  errorMessage={this.state.joinErrorMessage}
                />
              : 
              // if user has joined, render chatroom
              <Switch><Route
                  render={props => 
                    <Chatroom
                      client={this.state.client}
                      chatroomId={this.state.chatroomURL}
                      chatHistory={this.state.chatHistory}
                      userList={this.state.userList}
                      handleChangeURL={() => props.history.push(`/${this.state.chatroomURL}`)}
                    />}
                />
                </Switch>
          }
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default Root;