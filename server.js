const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// הגשת קבצים מהתיקייה הראשית
app.use(express.static(__dirname));

// ניתוב דף הבית להורה
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'parent.html'));
});

const ROOM_ID = "monitor_room_123";

io.on('connection', (socket) => {
    console.log('מכשיר מחובר:', socket.id);

    socket.on('join-room', () => {
        socket.join(ROOM_ID);
        console.log(`מכשיר ${socket.id} הצטרף לחדר`);
    });

    // העברת נתוני אודיו כפי שהם (Buffer)
    socket.on('audio-data', (data) => {
        socket.to(ROOM_ID).emit('play-audio', data);
    });

    socket.on('disconnect', () => {
        console.log('מכשיר התנתק');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
