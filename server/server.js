const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// const ChatroomManager = require('./ChatroomManager');
const Chatroom = require('./Chatroom');

const port = 3000;
// list of user-chatroom pairs
const usersChatrooms = []
// list of all chatrooms
const chatroomList = [];

server.listen(port, error => {
  if (error) throw error;
  console.log(`Listening on port ${port}`);
});

io.on('connection', client => {
  let id = client.id;
  
  client
    .on('message', (message, chatroomId, cb) => {
      // get chatroom from chatroomId 
      chatroom = chatroomList[chatroomId];
      // return message after it was saved in the storage
      savedMessage = chatroom.newMessage(message, client, Date.now());
      // broadcast new message to all users in the chatroom
      userList = chatroom.getUserList();
      Object.values(userList).forEach(u => u.client.emit('message', savedMessage));
      cb(null);
    })
    .on('join', ((userName, chatroomId, cb) => {
      if (!userName)
        return cb("Name cannot be empty.")

      // get chatroom by chatroomId or create a new one
      if (!chatroomId) {
        chatroomId = client.id;
        chatroomList[chatroomId] = Chatroom(chatroomId);
      }
      chatroom = chatroomList[chatroomId];
      
      if (!chatroom)
        return cb("Chatroom with given id does not exist.");

      if (chatroom.checkUsernameExistence(userName))
        return cb("This name is already taken. Please, choose another one.");

      // add user to the list of online users
      chatroom.addUser(client, userName);
      usersChatrooms[id] = chatroomId;
      // broadcast updated list of users to all users in the chatroom
      userList = chatroom.getUserList();
      Object.values(userList).forEach(u => u.client.emit('userlist', chatroom.getUsernamesList()));
      cb(null, chatroomId, chatroom.getChatHistory(), chatroom.getUsernamesList());
    }) )
    .on('disconnect', ()=>{
      // 
      chatroom = chatroomList[usersChatrooms[id]];
      delete usersChatrooms[id];
      // chatroom might be empty if the connection was ended before the user has joined
      if (chatroom) {
        chatroom.removeUser(id);
        // broadcast updated list of users to all users in the chatroom
        userList = chatroom.getUserList();
        Object.values(userList).forEach(u => u.client.emit('userlist', chatroom.getUsernamesList()));
      }
    });
});