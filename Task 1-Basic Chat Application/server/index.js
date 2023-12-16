const express = require('express');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "https://sigma-livechat.vercel.app/",
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket)=>{
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send-message', (data)=>{
        socket.to(data.room).emit('receive-message', data)
    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected', socket.id);
    })
});

server.listen(3001, ()=>{
    console.log('Server is running.')
});
