//created a name of the user.
const users = [];
const addUser = ({ id, name, room }) => {

  //trim will remove whitespaces 
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  //if any of the value name or room are not assigned then show this error.
  if(!name || !room) return { error: 'Username and room are required.' };

  //If user already exist then show the error  that user name is already taken.
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };
  users.push(user);
  return { user };
  
}

const removeUser = (id) => {

  //find the index of the user 
  const index = users.findIndex((user) => user.id === id);

  // then splice that user form index of 1 lenght and returning the name of the removed user
  if(index !== -1) return users.splice(index, 1)[0];
  
}

const getUser = (id) => users.find((user) => user.id === id);

//this will check if that user is in this particular room are not.
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

//exports these all files 
module.exports = { addUser, removeUser, getUser, getUsersInRoom };