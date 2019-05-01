module.exports = (id) => {
  const chatroomId = id;

  // user list is stored as ("userId": {"client", "username"} ) format
  // each chatroom has separate list of users
  let userList = [];

  /*
    chat history is stored as an array of messages.
    each message is an object containing following fields:
    "message" - text of the message
    "user" - sender's username
    "tms" - timestamp in milliseconds elapsed since the UNIX epoch
  */
  let chatHistory = [];


  // return user's name by client id
  // internal
  function getUsername(clientId) {
    return userList[clientId].username;
  }

  // add user to the chatroom
  function addUser(client, username) {
    userList[client.id] = {client, username};
  }

  // remove user from the chatroom
  function removeUser(clientId) {
    delete userList[clientId];
  }

  // get list of all users currently presented in the chatroom
  function getUserList() {
    return userList;
  }

  // get list of names of all users currently presented in the chatroom
  function getUsernamesList() {
    return Object.values(userList).map(u => u.username);
  }

  // check if username exists in this chatroom
  function checkUsernameExistence(username) {
    return Object.values(userList).filter(u => (u.username === username)).length > 0 ? true : false;
  }

  // add new message to the chatroom's message history
  // the message is then returned to be broadcasted to all clients
  function newMessage(message, client, tms) {
    newMessage = {message, user: getUsername(client.id), tms}
    chatHistory.push(newMessage);
    return newMessage;
  }

  // get chatroom's message history
  function getChatHistory() {
    return chatHistory;
  }

  return {
    chatroomId,
    addUser,
    removeUser,
    getUserList,
    getUsernamesList,
    checkUsernameExistence,
    newMessage,
    getChatHistory
  }
}