const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

const ROOM_ID = "monitor_room";

io.on('connection', (socket) => {
    socket.on('join-room', () => socket.join(ROOM_ID));

    // קבלת המידע מהילד כ-Buffer והפצה להורה
    socket.on('audio-data', (data) => {
        socket.to(ROOM_ID).emit('play-audio', data);
    });
});

server.listen(process.env.PORT || 3000);
