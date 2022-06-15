const express=require('express')
const socketio=require('socket.io')
const http=require('http');
const cors=require('cors')

const {addUser, removeUser, getUser, getUserInRoom, getUsersInRoom}=require('./user')

const app=express()

//to run on any port used process.env.PORT 1319 is my port
const PORT=process.env.PORT || 1319;


//router
const router=require('./router');
// const { isBooleanObject } = require('util/types');

const server=app.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT}`)
})

//This Cors policy to allow all the port so can they interact with each other.
//I have given access to all the port.
const io=socketio(server,{
     cors: "*"
})


// call router as middleware
app.use(router);
// make connection
io.on('connection',(socket)=>{
    console.log("We have a new Connection!!!")

     //now collect the message in backend from the front end
    socket.on('join', ({name,room}, callback)=>{
        
        const {error, user}= addUser({id:socket.id, name,room})


        //if error then return the errror of the addUser
        if(error)
        {
            return callback(error)
        }
        //System message if user join
         socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room ${user.room}.`})
        //broadcast the message to the room except that user.
         socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`})
         //else join the room
         socket.join(user.room);
         //if error

         //to see which users are inside the room
         io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)})

        callback();
      })

  //sending messaging by user to particular room
    socket.on('sendMessage', (message, callback)=>{
       const user=getUser(socket.id)
       

       //send message to the room
       io.to(user.room).emit('message', {user: user.name, text: message})
       //if user left the room then send the message
       io.to(user.room).emit('roomData',{room:user.room,users: getUsersInRoom(user.room)})
       callback();
    })

    
 //for diconnection of the particular socket.
    socket.on('disconnect',()=>{
        console.log("User Had Left!!")

        const user=removeUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left.`})
        }
    })

})

