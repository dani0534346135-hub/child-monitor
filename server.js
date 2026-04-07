const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

// הגשת קבצים סטטיים מהתיקייה הראשית
app.use(express.static(__dirname));

// פתרון ל-404: אם נכנסים לכתובת בלי שם קובץ, זה יפתח את דף ההורה
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'parent.html'));
});

const PORT = process.env.PORT || 3000;
const ROOM_ID = "family_room_123";

io.on('connection', (socket) => {
    socket.on('join-room', () => socket.join(ROOM_ID));
    
    socket.on('audio-data', (data) => {
        socket.to(ROOM_ID).emit('play-audio', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});
