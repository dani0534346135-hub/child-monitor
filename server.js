const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// הגדרת Socket.io עם הרשאות לכל מקור (CORS)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// מגיש באופן אוטומטי את כל הקבצים שבתיקיית public
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const ROOM_ID = "family_private_room_123"; // מזהה חדר סודי

io.on('connection', (socket) => {
    console.log('מכשיר התחבר:', socket.id);

    // הצטרפות לחדר משותף
    socket.on('join-room', () => {
        socket.join(ROOM_ID);
        console.log(`מכשיר ${socket.id} הצטרף לחדר הבקרה`);
    });

    // קבלת נתוני אודיו מהילד והפצתם לכל מי שבחדר (להורה)
    socket.on('audio-stream', (audioData) => {
        socket.to(ROOM_ID).emit('play-audio', audioData);
    });

    socket.on('disconnect', () => {
        console.log('מכשיר התנתק');
    });
});

server.listen(PORT, () => {
    console.log(`השרת רץ בפורט: ${PORT}`);
});
