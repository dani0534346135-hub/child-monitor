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
    // הצטרפות לחדר הכללי
    socket.on('join-room', (userData) => {
        socket.join(ROOM_ID);
        // שמירת שם הילד על הסוקט כדי שנדע מי זה
        socket.userName = userData ? userData.name : "ילד ללא שם";
        console.log(`${socket.userName} מחובר`);
    });

    // העברת נתוני אודיו + שם הילד
    socket.on('audio-data', (data) => {
        socket.to(ROOM_ID).emit('play-audio', {
            audio: data,
            childName: socket.userName,
            childId: socket.id
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
