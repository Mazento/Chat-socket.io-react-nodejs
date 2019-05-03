import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import UserList from './UserList';

class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      input: '',
      chatroomId: this.props.chatroomId,
      chatHistory: this.props.chatHistory,
      userList: this.props.userList
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.handleUserlistUpdate = this.handleUserlistUpdate.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    // subscribe to 'new message' socket event
    this.state.client.on('message', this.handleMessageReceived);
    // subscribe to 'update userlist' socket event
    this.state.client.on('userlist', this.handleUserlistUpdate);
    // redirect to the new room after joining
    this.props.handleChangeURL();
  }
  
  handleInput(e) {
    this.setState({ input: e.target.value })
  }

  // after receiving a message add it to the local chatHistory storage
  handleMessageReceived(message) {
    this.setState({ chatHistory: this.state.chatHistory.concat(message) })
  }

  // update list of online users
  handleUserlistUpdate(userList) {
    this.setState({ userList })
  }

  // send message to the server
  handleSendMessage() {
    if (!this.state.input)
      return;
    
    this.state.client.emit('message', this.state.input, this.state.chatroomId, (err) => {
      if (err)
        return console.error(err);
      return this.setState({ input: '' });
    })
  }

  // convert Unix epoch to human-readable format
  convertTmsToTime(tms) {
    const date = new Date(tms);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
  }
  
  render() {
    return (
      <Grid
        container
        spacing={24}
        alignItems="flex-start"
        justify="center"
        style={{ minHeight: '90vh' }}
      >
        {/* chat messages window */}
        <Grid
          container
          item xs={6}
          justify="flex-end"
        >        
          <Paper className="chat-window" justify = "center">
            <List style={{height: 400, overflow: 'auto'}}>
              {
                this.state.chatHistory.map(
                  ({ user, message, tms }, i) => [
                    <React.Fragment key={i}>
                      <ListItem >
                        <ListItemText
                          primary={            
                            <React.Fragment>
                              <a className="chat-name">
                                { user }
                              </a>
                              <a className="chat-datetime">
                                { this.convertTmsToTime(tms) }
                              </a>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" >
                                { message }
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="middle" />
                    </React.Fragment>
                  ]
                )
              }
            </List>
            {/*
              'Send new message' field.
              Works on button and 'enter' key press.
            */}
            <Grid
              container
              justify="space-evenly"
              className="chat-send-message"
            >
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Write a message..."
                  onChange={this.handleInput}
                  value={this.state.input}
                  onKeyPress={e => (e.key === 'Enter' ? this.handleSendMessage() : null)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSendMessage}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          container
          item xs={6}
          justify="flex-start"
        >
          {/* List of online users */}
          <UserList userList={this.state.userList} />
        </Grid>
      </Grid>
    )
  }
}

export default Chatroom;
