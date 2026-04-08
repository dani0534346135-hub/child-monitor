const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7 // מאפשר העברת חבילות מידע גדולות
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    socket.on('join-room', (userData) => {
        socket.join("monitor_room");
        socket.userName = userData ? userData.name : "ילד";
        console.log(`מחובר: ${socket.userName}`);
    });

    socket.on('audio-data', (data) => {
        socket.to("monitor_room").emit('play-audio', {
            audio: data,
            childName: socket.userName,
            childId: socket.id
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
