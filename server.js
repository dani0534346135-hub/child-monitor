const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

const ROOM_ID = "monitor_room_global";

io.on('connection', (socket) => {
    socket.on('join-room', (userData) => {
        socket.join(ROOM_ID);
        socket.userName = userData ? userData.name : "ילד ללא שם";
        console.log(`מכשיר מחובר: ${socket.userName}`);
    });

    socket.on('audio-data', (data) => {
        // שולחים את האודיו לכל מי שבחדר (להורה)
        socket.to(ROOM_ID).emit('play-audio', {
            audio: data,
            childName: socket.userName,
            childId: socket.id
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
