import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*
  Attempt to join the chatroom.
  The attempt will be a failure if:
  1. Name is not set (empty).
  2. User with given name is already presented in the chatroom.
  3. Specified chatroom does not exist.
  In case of an error the corresponding message will be displayed.
*/

class JoinWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { inputUsername: '' }

    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  handleInput(e) {
    this.setState({ inputUsername: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    // read chatroom id from URL
    const chatroom = window.location.pathname.slice(1);
    this.props.joinChat(this.state.inputUsername, chatroom);
    this.setState({ inputUsername: '' });
  }
  
  render() {
    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Paper className="join-window" justify = "center">
          <Typography variant="h6" paragraph>
            Please, enter your name
          </Typography>
          {/* display an error if presented */}
          {
            this.props.errorMessage
            ? <Typography variant="body2" color="error" paragraph>
                {this.props.errorMessage}
            </Typography>
            : null
          }
          <form onSubmit={this.handleSubmit}>
            <TextField
              onChange={this.handleInput}
              placeholder="Name"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    )
  }
}

export default JoinWindow;
