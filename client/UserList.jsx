import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

/*
  Display list of all users currently online in specified chatroom.
  User leaves the chatroom after socket connection has been ended.
  There cannot be username duplicated in one chatroom.
  Same username can still be used in different chatrooms.
*/
class UserList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userList: this.props.userList
    }
  }  
  
  // re-render after parent's state has been updated
  componentWillReceiveProps(newProps) {
    if (newProps.userList !== this.state.userList) {
      this.setState({ userList: newProps.userList });
    }
  };
  
  render() {
    return (
      <Paper className="chat-userlist" justify = "center">      
        <List style={{maxHeight: 400, overflow: 'auto'}} dense={true}>
          <ListItem>
            <ListItemText primary={`Users online: ${this.state.userList.length}`} >
            </ListItemText>
          </ListItem>
          <Divider variant="middle" light/>
          {/* render list of users */}
          {
            this.state.userList.map(
              (username, i) => [
                <React.Fragment key={i}>
                  <ListItem >
                    <ListItemText
                      secondary={ username }
                    />
                  </ListItem>
                  <Divider variant="middle" />
                </React.Fragment>
              ]
            )
          }
        </List>
      </Paper>
    )
  }
}

export default UserList;
